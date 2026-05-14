import { z } from "zod";

export const entitySchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const actionSchema = z.object({
  id: z.string().min(1),
  intent: z.enum(["navigation", "mutation", "query", "system"]),
  deterministic: z.boolean().default(true),
  description: z.string().optional(),
  /** JSON Schema for action inputs (agents/MCP); often derived from optional Zod `inputSchema` at registration. */
  inputJsonSchema: z.record(z.string(), z.unknown()).optional(),
});

export const capabilitySchema = z.object({
  canSearch: z.boolean().optional(),
  canCheckout: z.boolean().optional(),
  canNavigate: z.boolean().optional(),
});

export const workflowSchema = z.object({
  id: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
});

export type SemanticEntity = z.infer<typeof entitySchema>;
export type SemanticAction = z.infer<typeof actionSchema>;
export type CapabilityProfile = z.infer<typeof capabilitySchema>;
export type WorkflowDefinition = z.infer<typeof workflowSchema>;

/** Accepted shape for `registerAction` — optional Zod input schema is stripped before validation and drives `inputJsonSchema`. */
export type RegisterActionInput = Omit<SemanticAction, "deterministic"> & {
  deterministic?: boolean;
  inputSchema?: z.ZodTypeAny;
};

export type PolicyContext = {
  actor: "human" | "agent" | "voice";
  roles: string[];
};

export type PolicyDecision =
  | { allowed: true }
  | { allowed: false; reason: string };

export type PolicyRule = (
  ctx: PolicyContext,
  action: SemanticAction,
) => PolicyDecision | null;

/** Effective context passed to bound action handlers (extends policy context). */
export type ActionExecutionContext = PolicyContext & {
  sessionId?: string;
};

export type SemanticActionHandler = (
  ctx: ActionExecutionContext,
  input: unknown,
) => unknown | Promise<unknown>;

export type ExecuteActionOptions = {
  sessionId?: string;
};

export type ExecuteActionResult = {
  ok: boolean;
  message?: string;
  data?: unknown;
};

export type RuntimeEvent =
  | { type: "entity:registered"; entity: SemanticEntity }
  | { type: "entity:queried"; entityId: string }
  | { type: "entity:updated"; entity: SemanticEntity }
  | { type: "entity:removed"; entityId: string }
  | { type: "action:registered"; action: SemanticAction }
  | {
      type: "action:attempt";
      actionId: string;
      context: PolicyContext;
      sessionId?: string;
    }
  | {
      type: "action:result";
      actionId: string;
      ok: boolean;
      message?: string;
      data?: unknown;
    }
  | { type: "action:executed"; actionId: string }
  | { type: "capability:registered"; capabilities: CapabilityProfile }
  | { type: "workflow:registered"; workflow: WorkflowDefinition }
  | { type: "workflow:started"; workflowId: string }
  | {
      type: "workflow:step";
      workflowId: string;
      stepIndex: number;
      stepId: string;
    }
  | { type: "workflow:completed"; workflowId: string }
  | { type: "workflow:failed"; workflowId: string; error: string }
  | { type: "session:started"; sessionId: string }
  | { type: "session:ended"; sessionId: string }
  | {
      type: "intent:expressed";
      intentId: string;
      intent: string;
      metadata?: Record<string, unknown>;
    }
  | { type: "intent:resolved"; intentId: string }
  | { type: "intent:abandoned"; intentId: string }
  | { type: "intent:failed"; intentId: string; error: string }
  | { type: "policy:evaluated"; actionId: string; decision: PolicyDecision }
  | { type: "policy:denied"; actionId: string; reason: string };
