export type {
  SemanticEntity,
  SemanticAction,
  CapabilityProfile,
  WorkflowDefinition,
  PolicyContext,
  PolicyDecision,
  PolicyRule,
  RuntimeEvent,
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
} from "./types.js";

export function registerEntity(
  input: Omit<SemanticEntity, "metadata"> & { metadata?: Record<string, unknown> },
): SemanticEntity {
  return getSemanticRegistry().registerEntity(input);
}

export function registerAction(
  input: Omit<SemanticAction, "deterministic"> & { deterministic?: boolean },
): SemanticAction {
  return getSemanticRegistry().registerAction(input);
}

export function registerCapability(input: CapabilityProfile): CapabilityProfile {
  return getSemanticRegistry().registerCapability(input);
}

export function registerWorkflow(input: WorkflowDefinition): WorkflowDefinition {
  return getSemanticRegistry().registerWorkflow(input);
}
