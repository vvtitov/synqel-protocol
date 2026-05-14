# Event Taxonomy

> 20 event kinds across 6 categories — the complete observability layer for Synqel Protocol.

## Categories

| Category | Description |
|---|---|
| `semantic.entity` | Entity lifecycle events |
| `semantic.action` | Action registration and execution events |
| `semantic.workflow` | Workflow lifecycle events |
| `semantic.session` | Session boundary events |
| `semantic.intent` | User/agent intent tracking events |
| `semantic.policy` | Policy evaluation events |

## semantic.entity

| Event Kind | When it fires | Payload |
|---|---|---|
| `semantic.entity.registered` | `registerEntity()` is called | `{ type: "entity:registered"; entity: SemanticEntity }` |
| `semantic.entity.queried` | `getEntity()` finds an entity | `{ type: "entity:queried"; entityId: string }` |
| `semantic.entity.updated` | `updateEntity()` is called | `{ type: "entity:updated"; entity: SemanticEntity }` |
| `semantic.entity.removed` | `removeEntity()` succeeds | `{ type: "entity:removed"; entityId: string }` |

## semantic.action

| Event Kind | When it fires | Payload |
|---|---|---|
| `semantic.action.attempt` | Action execution is attempted (before policy) | `{ type: "action:attempt"; actionId: string; context: PolicyContext; sessionId?: string }` |
| `semantic.action.result` | After execution attempt completes | `{ type: "action:result"; actionId: string; ok: boolean; message?: string; data?: unknown }` |
| `semantic.action.executed` | Action passes policy; handler ran successfully | `{ type: "action:executed"; actionId: string }` |

## semantic.workflow

| Event Kind | When it fires | Payload |
|---|---|---|
| `semantic.workflow.started` | Workflow orchestration begins | `{ type: "workflow:started"; workflowId: string }` |
| `semantic.workflow.step` | Workflow advances to next step | `{ type: "workflow:step"; workflowId: string; stepIndex: number; stepId: string }` |
| `semantic.workflow.completed` | All steps complete successfully | `{ type: "workflow:completed"; workflowId: string }` |
| `semantic.workflow.failed` | Workflow fails at any step | `{ type: "workflow:failed"; workflowId: string; error: string }` |

> **SDK note:** `registerWorkflow()` emits **`workflow:registered`** on the in-process bus (colon notation). There is no `semantic.workflow.registered` entry in `EVENT_KINDS` yet — taxonomy constants above align with future orchestration. **`semantic.action.attempt`** payloads may include optional **`sessionId`** when callers pass one into `executeAction`.

## semantic.session

| Event Kind | When it fires | Payload |
|---|---|---|
| `semantic.session.started` | `SemanticRegistry.startSession()` (or host lifecycle) | `{ type: "session:started"; sessionId: string }` |
| `semantic.session.ended` | `SemanticRegistry.endSession(sessionId)` | `{ type: "session:ended"; sessionId: string }` |
| `semantic.session.heartbeat` | Periodic signal that session is active | Taxonomy-only (not yet in RuntimeEvent union) |

## semantic.intent

| Event Kind | When it fires | Payload |
|---|---|---|
| `semantic.intent.expressed` | User or agent expresses an intent | `{ type: "intent:expressed"; intentId: string; intent: string; metadata?: Record<string, unknown> }` |
| `semantic.intent.resolved` | Intent is successfully fulfilled | `{ type: "intent:resolved"; intentId: string }` |
| `semantic.intent.abandoned` | Intent is abandoned before resolution | `{ type: "intent:abandoned"; intentId: string }` |
| `semantic.intent.failed` | Intent fails to resolve | `{ type: "intent:failed"; intentId: string; error: string }` |

## semantic.policy

| Event Kind | When it fires | Payload |
|---|---|---|
| `semantic.policy.evaluated` | Policy evaluation completes | `{ type: "policy:evaluated"; actionId: string; decision: PolicyDecision }` |
| `semantic.policy.denied` | Policy denies an action | `{ type: "policy:denied"; actionId: string; reason: string }` |

## SDK utilities

```typescript
import {
  EVENT_CATEGORIES,
  EVENT_KINDS,
  getCategoryFromKind,
  isValidEventKind,
} from "@synqel/sdk";

// Get the category for an event kind
getCategoryFromKind("semantic.entity.registered");
// → "semantic.entity"

// Type guard for event kinds
if (isValidEventKind(someString)) {
  // someString is now typed as EventKind
}
```
