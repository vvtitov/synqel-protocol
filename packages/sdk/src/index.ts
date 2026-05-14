export type {
  SemanticEntity,
  SemanticAction,
  RegisterActionInput,
  CapabilityProfile,
  WorkflowDefinition,
  PolicyContext,
  PolicyDecision,
  PolicyRule,
  RuntimeEvent,
  ActionExecutionContext,
  SemanticActionHandler,
  ExecuteActionOptions,
  ExecuteActionResult,
} from "./types.js";

export {
  entitySchema,
  actionSchema,
  capabilitySchema,
  workflowSchema,
} from "./types.js";

export {
  SemanticEventBus,
  SemanticRegistry,
  getSemanticRegistry,
  resetSemanticRegistryForTests,
} from "./registry.js";

export type { RegistrySnapshot } from "./registry.js";

export type { SynqelSnapshotEnvelope } from "./snapshot.js";
export {
  createSnapshotEnvelope,
  serializeSnapshotEnvelope,
  synqelSnapshotJsonResponse,
} from "./snapshot.js";

export { evaluatePolicy } from "./policy.js";

export {
  EVENT_CATEGORIES,
  EVENT_KINDS,
  getCategoryFromKind,
  isValidEventKind,
} from "./event-taxonomy.js";

export type { EventCategory, EventKind } from "./event-taxonomy.js";

import { getSemanticRegistry } from "./registry.js";
import type {
  SemanticEntity,
  SemanticAction,
  CapabilityProfile,
  WorkflowDefinition,
  RegisterActionInput,
  PolicyContext,
  SemanticActionHandler,
  ExecuteActionOptions,
  ExecuteActionResult,
} from "./types.js";

export function registerEntity(
  input: Omit<SemanticEntity, "metadata"> & { metadata?: Record<string, unknown> },
): SemanticEntity {
  return getSemanticRegistry().registerEntity(input);
}

export function registerAction(input: RegisterActionInput): SemanticAction {
  return getSemanticRegistry().registerAction(input);
}

export function registerCapability(input: CapabilityProfile): CapabilityProfile {
  return getSemanticRegistry().registerCapability(input);
}

export function registerWorkflow(input: WorkflowDefinition): WorkflowDefinition {
  return getSemanticRegistry().registerWorkflow(input);
}

export function bindAction(actionId: string, handler: SemanticActionHandler): void {
  getSemanticRegistry().bindAction(actionId, handler);
}

export function unbindAction(actionId: string): boolean {
  return getSemanticRegistry().unbindAction(actionId);
}

export function executeAction(
  actionId: string,
  context: PolicyContext,
  input?: unknown,
  options?: ExecuteActionOptions,
): Promise<ExecuteActionResult> {
  return getSemanticRegistry().executeAction(actionId, context, input, options);
}
