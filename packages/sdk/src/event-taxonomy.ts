export const EVENT_CATEGORIES = [
  "semantic.entity",
  "semantic.action",
  "semantic.workflow",
  "semantic.session",
  "semantic.intent",
  "semantic.policy",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EVENT_KINDS = [
  "semantic.entity.registered",
  "semantic.entity.queried",
  "semantic.entity.updated",
  "semantic.entity.removed",
  "semantic.action.attempt",
  "semantic.action.result",
  "semantic.action.executed",
  "semantic.workflow.started",
  "semantic.workflow.step",
  "semantic.workflow.completed",
  "semantic.workflow.failed",
  "semantic.session.started",
  "semantic.session.ended",
  "semantic.session.heartbeat",
  "semantic.intent.expressed",
  "semantic.intent.resolved",
  "semantic.intent.abandoned",
  "semantic.intent.failed",
  "semantic.policy.evaluated",
  "semantic.policy.denied",
] as const;

export type EventKind = (typeof EVENT_KINDS)[number];

export function getCategoryFromKind(kind: EventKind): EventCategory {
  const parts = kind.split(".");
  return `${parts[0]}.${parts[1]}` as EventCategory;
}

export function isValidEventKind(kind: string): kind is EventKind {
  return (EVENT_KINDS as readonly string[]).includes(kind);
}
