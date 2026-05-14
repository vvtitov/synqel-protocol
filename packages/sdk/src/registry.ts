import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type {
  SemanticEntity,
  SemanticAction,
  CapabilityProfile,
  WorkflowDefinition,
  RuntimeEvent,
  PolicyContext,
  SemanticActionHandler,
  ExecuteActionOptions,
  ExecuteActionResult,
} from "./types.js";
import {
  entitySchema,
  actionSchema,
  capabilitySchema,
  workflowSchema,
} from "./types.js";
import { evaluatePolicy } from "./policy.js";

function createSessionId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  return `sess_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

type EventListener = (event: RuntimeEvent) => void;

export class SemanticEventBus {
  private listeners = new Set<EventListener>();

  subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(event: RuntimeEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

export type RegistrySnapshot = {
  entities: SemanticEntity[];
  actions: SemanticAction[];
  capabilities: CapabilityProfile;
  workflows: WorkflowDefinition[];
};

function stripRegisterActionExtras(input: unknown): unknown {
  if (!input || typeof input !== "object") return input;
  const { inputSchema: _ignored, ...rest } = input as Record<string, unknown>;
  return rest;
}

export class SemanticRegistry {
  readonly bus = new SemanticEventBus();

  private entities = new Map<string, SemanticEntity>();
  private actions = new Map<string, SemanticAction>();
  private capabilities: CapabilityProfile = {};
  private workflows = new Map<string, WorkflowDefinition>();
  private version = 0;

  private actionHandlers = new Map<string, SemanticActionHandler>();
  private actionInputZod = new Map<string, z.ZodTypeAny>();

  registerEntity(input: unknown): SemanticEntity {
    const entity = entitySchema.parse(input);
    this.entities.set(entity.id, entity);
    this.version++;
    this.bus.emit({ type: "entity:registered", entity });
    return entity;
  }

  getEntity(id: string): SemanticEntity | undefined {
    const entity = this.entities.get(id);
    if (entity) {
      this.bus.emit({ type: "entity:queried", entityId: id });
    }
    return entity;
  }

  updateEntity(input: unknown): SemanticEntity {
    const entity = entitySchema.parse(input);
    this.entities.set(entity.id, entity);
    this.version++;
    this.bus.emit({ type: "entity:updated", entity });
    return entity;
  }

  removeEntity(id: string): boolean {
    const removed = this.entities.delete(id);
    if (removed) {
      this.version++;
      this.bus.emit({ type: "entity:removed", entityId: id });
    }
    return removed;
  }

  registerAction(input: unknown): SemanticAction {
    const raw =
      input && typeof input === "object"
        ? (input as Record<string, unknown>)
        : null;
    const zodInput =
      raw && "inputSchema" in raw ? (raw.inputSchema as z.ZodTypeAny | undefined) : undefined;

    const baseParsed = actionSchema.parse(stripRegisterActionExtras(input));

    let inputJsonSchema = baseParsed.inputJsonSchema;
    if (zodInput !== undefined && zodInput !== null) {
      inputJsonSchema = zodToJsonSchema(zodInput, {
        target: "jsonSchema7",
      }) as Record<string, unknown>;
      this.actionInputZod.set(baseParsed.id, zodInput);
    } else {
      this.actionInputZod.delete(baseParsed.id);
    }

    const action: SemanticAction = {
      ...baseParsed,
      ...(inputJsonSchema !== undefined ? { inputJsonSchema } : {}),
    };

    this.actions.set(action.id, action);
    this.version++;
    this.bus.emit({ type: "action:registered", action });
    return action;
  }

  getAction(id: string): SemanticAction | undefined {
    return this.actions.get(id);
  }

  bindAction(actionId: string, handler: SemanticActionHandler): void {
    this.actionHandlers.set(actionId, handler);
  }

  unbindAction(actionId: string): boolean {
    return this.actionHandlers.delete(actionId);
  }

  async executeAction(
    actionId: string,
    context: PolicyContext,
    input?: unknown,
    options?: ExecuteActionOptions,
  ): Promise<ExecuteActionResult> {
    const action = this.actions.get(actionId);
    if (!action) {
      const message = `Action "${actionId}" not found in registry.`;
      this.bus.emit({
        type: "action:result",
        actionId,
        ok: false,
        message,
      });
      return { ok: false, message };
    }

    const sessionId = options?.sessionId;
    this.bus.emit({
      type: "action:attempt",
      actionId,
      context,
      ...(sessionId !== undefined ? { sessionId } : {}),
    });

    const decision = evaluatePolicy(context, action);
    this.bus.emit({ type: "policy:evaluated", actionId, decision });

    if (!decision.allowed) {
      this.bus.emit({
        type: "policy:denied",
        actionId,
        reason: decision.reason,
      });
      this.bus.emit({
        type: "action:result",
        actionId,
        ok: false,
        message: decision.reason,
      });
      return { ok: false, message: decision.reason };
    }

    const zodSchema = this.actionInputZod.get(actionId);
    let parsedInput: unknown = input;
    if (zodSchema) {
      const parsed = zodSchema.safeParse(input);
      if (!parsed.success) {
        const message = parsed.error.message;
        this.bus.emit({
          type: "action:result",
          actionId,
          ok: false,
          message,
        });
        return { ok: false, message };
      }
      parsedInput = parsed.data;
    }

    const handler = this.actionHandlers.get(actionId);
    if (!handler) {
      const message = `No handler bound for action "${actionId}".`;
      this.bus.emit({
        type: "action:result",
        actionId,
        ok: false,
        message,
      });
      return { ok: false, message };
    }

    const execCtx = { ...context, ...(sessionId !== undefined ? { sessionId } : {}) };

    try {
      const data = await handler(execCtx, parsedInput);
      this.bus.emit({ type: "action:executed", actionId });
      this.bus.emit({
        type: "action:result",
        actionId,
        ok: true,
        ...(data !== undefined ? { data } : {}),
      });
      return { ok: true, ...(data !== undefined ? { data } : {}) };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Action handler threw a non-Error value.";
      this.bus.emit({
        type: "action:result",
        actionId,
        ok: false,
        message,
      });
      return { ok: false, message };
    }
  }

  /**
   * Starts a logical agent/session span and emits `session:started`.
   * Pair with {@link endSession} or pass the id into {@link executeAction}.
   */
  startSession(): string {
    const sessionId = createSessionId();
    this.bus.emit({ type: "session:started", sessionId });
    return sessionId;
  }

  endSession(sessionId: string): void {
    this.bus.emit({ type: "session:ended", sessionId });
  }

  registerCapability(input: unknown): CapabilityProfile {
    const caps = capabilitySchema.parse(input);
    this.capabilities = { ...this.capabilities, ...caps };
    this.version++;
    this.bus.emit({ type: "capability:registered", capabilities: this.capabilities });
    return this.capabilities;
  }

  registerWorkflow(input: unknown): WorkflowDefinition {
    const workflow = workflowSchema.parse(input);
    this.workflows.set(workflow.id, workflow);
    this.version++;
    this.bus.emit({ type: "workflow:registered", workflow });
    return workflow;
  }

  getWorkflow(id: string): WorkflowDefinition | undefined {
    return this.workflows.get(id);
  }

  getSnapshot(): RegistrySnapshot {
    return {
      entities: Array.from(this.entities.values()),
      actions: Array.from(this.actions.values()),
      capabilities: { ...this.capabilities },
      workflows: Array.from(this.workflows.values()),
    };
  }

  getVersion(): number {
    return this.version;
  }

  reset(): void {
    this.entities.clear();
    this.actions.clear();
    this.capabilities = {};
    this.workflows.clear();
    this.version = 0;
    this.actionHandlers.clear();
    this.actionInputZod.clear();
  }
}

let globalRegistry: SemanticRegistry | null = null;

export function getSemanticRegistry(): SemanticRegistry {
  if (!globalRegistry) {
    globalRegistry = new SemanticRegistry();
  }
  return globalRegistry;
}

export function resetSemanticRegistryForTests(): void {
  if (globalRegistry) {
    globalRegistry.reset();
  }
  globalRegistry = null;
}
