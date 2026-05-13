import type {
  SemanticEntity,
  SemanticAction,
  CapabilityProfile,
  WorkflowDefinition,
  RuntimeEvent,
} from "./types.js";
import {
  entitySchema,
  actionSchema,
  capabilitySchema,
  workflowSchema,
} from "./types.js";

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

export class SemanticRegistry {
  readonly bus = new SemanticEventBus();

  private entities = new Map<string, SemanticEntity>();
  private actions = new Map<string, SemanticAction>();
  private capabilities: CapabilityProfile = {};
  private workflows = new Map<string, WorkflowDefinition>();
  private version = 0;

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
    const action = actionSchema.parse(input);
    this.actions.set(action.id, action);
    this.version++;
    this.bus.emit({ type: "action:registered", action });
    return action;
  }

  getAction(id: string): SemanticAction | undefined {
    return this.actions.get(id);
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
