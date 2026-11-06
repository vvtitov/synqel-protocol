# Event Taxonomy

> 20 event kinds across 6 categories: the observability layer of the Synqel Protocol.

Registry operations (registration, entity changes, execution, sessions) emit a typed `RuntimeEvent` on the registry's event bus. Agents and observability tools subscribe with `registry.bus.subscribe(...)` or the React hook `useSemanticEvents` (see [SemanticEventBus](./sdk.md#semanticeventbus)).

## Event names

Each event has two names:

| Name | Example | Where it appears |
|---|---|---|
| Event kind (taxonomy) | `semantic.entity.registered` | `EVENT_KINDS`, `EVENT_CATEGORIES`, cross-system logs |
| Bus type | `entity:registered` | The `type` field of every `RuntimeEvent` you receive on the bus |

The kind is `semantic.<category>.<name>`; the bus type is `<category>:<name>`. The tables below list both: the kind in the first column and the bus type in the payload.

## Categories

| Category | Description |
|---|---|
| `semantic.entity` | Lifecycle events for entities registered in the semantic registry |
| `semantic.action` | Policy-gated action execution and results |
| `semantic.workflow` | Workflow lifecycle: start, step progression, completion, failure |
| `semantic.session` | Session boundaries for tracking agent interactions |
| `semantic.intent` | Expressed user or agent intents through their lifecycle |
| `semantic.policy` | Policy evaluation outcomes |

## semantic.entity

| Event kind | When it fires | Payload |
|---|---|---|
| `semantic.entity.registered` | `registerEntity()` is called | `{ type: "entity:registered"; entity: SemanticEntity }` |
| `semantic.entity.queried` | `getEntity()` finds an entity | `{ type: "entity:queried"; entityId: string }` |
| `semantic.entity.updated` | `updateEntity()` is called | `{ type: "entity:updated"; entity: SemanticEntity }` |
| `semantic.entity.removed` | `removeEntity()` removes an entity | `{ type: "entity:removed"; entityId: string }` |

## semantic.action

| Event kind | When it fires | Payload |
|---|---|---|
| `semantic.action.attempt` | `executeAction` begins for a registered action, before policy evaluation | `{ type: "action:attempt"; actionId: string; context: PolicyContext; sessionId?: string }` |
| `semantic.action.result` | An execution attempt completes: unknown action, policy denial, validation error, missing handler, handler result, or thrown error | `{ type: "action:result"; actionId: string; ok: boolean; message?: string; data?: unknown }` |
| `semantic.action.executed` | Policy passed, validation succeeded, and the bound handler completed without throwing | `{ type: "action:executed"; actionId: string }` |

`action:attempt` carries `sessionId` only when the caller passed one to `executeAction`. On a `handler_error`, `action:result` carries the handler's original error message, even when `@synqel/mcp` hides it from the agent.

The order of events in one `executeAction` call:

```text title="Event order"
unknown action:   action:result (ok: false)
policy denied:    action:attempt → policy:evaluated → policy:denied → action:result (ok: false)
invalid input:    action:attempt → policy:evaluated → action:result (ok: false)
no handler:       action:attempt → policy:evaluated → action:result (ok: false)
handler threw:    action:attempt → policy:evaluated → action:result (ok: false)
success:          action:attempt → policy:evaluated → action:executed → action:result (ok: true)
```

## semantic.workflow

| Event kind | When it fires | Payload |
|---|---|---|
| `semantic.workflow.started` | A workflow execution begins | `{ type: "workflow:started"; workflowId: string }` |
| `semantic.workflow.step` | A workflow advances to the next step | `{ type: "workflow:step"; workflowId: string; stepIndex: number; stepId: string }` |
| `semantic.workflow.completed` | All steps in a workflow complete successfully | `{ type: "workflow:completed"; workflowId: string }` |
| `semantic.workflow.failed` | A workflow fails at any step | `{ type: "workflow:failed"; workflowId: string; error: string }` |

The SDK does not run workflows, so it never emits these four events. They are reserved for a workflow orchestrator; a host can emit them with `registry.bus.emit(...)`.

## semantic.session

| Event kind | When it fires | Payload |
|---|---|---|
| `semantic.session.started` | `SemanticRegistry.startSession()` runs (or your host emits the same) | `{ type: "session:started"; sessionId: string }` |
| `semantic.session.ended` | `SemanticRegistry.endSession(sessionId)` runs | `{ type: "session:ended"; sessionId: string }` |
| `semantic.session.heartbeat` | Periodic signal that a session is still active | None: taxonomy-only, not yet in the `RuntimeEvent` union |

## semantic.intent

| Event kind | When it fires | Payload |
|---|---|---|
| `semantic.intent.expressed` | A user or agent expresses an intent (for example "I want to check out") | `{ type: "intent:expressed"; intentId: string; intent: string; metadata?: Record<string, unknown> }` |
| `semantic.intent.resolved` | An expressed intent is successfully fulfilled | `{ type: "intent:resolved"; intentId: string }` |
| `semantic.intent.abandoned` | An intent is abandoned before resolution | `{ type: "intent:abandoned"; intentId: string }` |
| `semantic.intent.failed` | An intent fails to resolve | `{ type: "intent:failed"; intentId: string; error: string }` |

The SDK does not track intents itself. These events are part of the `RuntimeEvent` union so your host can emit them with `registry.bus.emit(...)`.

## semantic.policy

| Event kind | When it fires | Payload |
|---|---|---|
| `semantic.policy.evaluated` | `executeAction` evaluated policy (allowed or denied) | `{ type: "policy:evaluated"; actionId: string; decision: PolicyDecision }` |
| `semantic.policy.denied` | `executeAction` was denied by policy | `{ type: "policy:denied"; actionId: string; reason: string }` |

Calling `evaluatePolicy` directly emits neither event.

## Registration events

Registration also emits bus events that have no entry in `EVENT_KINDS`:

| Bus type | When it fires | Payload |
|---|---|---|
| `action:registered` | `registerAction()` is called | `{ type: "action:registered"; action: SemanticAction }` |
| `capability:registered` | `registerCapability()` is called | `{ type: "capability:registered"; capabilities: CapabilityProfile }` (the merged profile) |
| `workflow:registered` | `registerWorkflow()` is called | `{ type: "workflow:registered"; workflow: WorkflowDefinition }` |

## Using the taxonomy in code

The SDK exports type-safe utilities for working with event kinds:

| Export | Description |
|---|---|
| `EVENT_CATEGORIES` | Readonly tuple of all 6 category strings |
| `EVENT_KINDS` | Readonly tuple of all 20 event kind strings |
| `getCategoryFromKind(kind)` | Extracts the category from an event kind |
| `isValidEventKind(kind)` | Type guard that checks whether a string is a valid event kind |
| `EventCategory`, `EventKind` | The matching union types |

```typescript
import {
  EVENT_CATEGORIES,
  EVENT_KINDS,
  getCategoryFromKind,
  isValidEventKind,
} from "@synqel/sdk";

console.log(EVENT_CATEGORIES.length, EVENT_KINDS.length); // 6 20

// Get the category for an event kind
getCategoryFromKind("semantic.entity.registered");
// → "semantic.entity"

// Type guard for event kinds
const someString: string = "semantic.policy.denied";
if (isValidEventKind(someString)) {
  // someString is now typed as EventKind
  console.log(getCategoryFromKind(someString)); // "semantic.policy"
}
```
