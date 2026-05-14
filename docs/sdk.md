# SDK Reference

> `@synqel/sdk` — Semantic runtime SDK for the Synqel Protocol.

Synqel describes **what your application means** (entities, actions, workflows) and **what each actor may do** (policy). [**Model Context Protocol**](https://modelcontextprotocol.io/) (MCP) is one way for agents to *reach* that surface: use the sibling package **`@synqel/mcp`** for stdio MCP tools (`synqel_get_snapshot`, `synqel_execute_action`). Synqel stays portable — REST, WebSockets, or in-process hooks remain valid.

## Installation

```bash
bun add @synqel/sdk zod
```

The SDK lists **`zod`** as a peer dependency and ships **`zod-to-json-schema`** so optional Zod action inputs become portable **JSON Schema** in the snapshot.

React is optional — only needed for `@synqel/sdk/react`.

## Convenience functions

### registerEntity

Validates input against the entity Zod schema and registers it in the global registry. Returns the parsed `SemanticEntity`. Emits `entity:registered`.

### registerAction

Validates and registers a semantic action. `deterministic` defaults to `true`.

Optional **`inputSchema`** (a Zod object) is accepted alongside the protocol fields; it is **not** stored as-is but used to populate **`inputJsonSchema`** on the stored action and to validate payloads during **`executeAction`**.

```typescript
import { registerAction } from "@synqel/sdk";
import { z } from "zod";

registerAction({
  id: "submit_order",
  intent: "mutation",
  inputSchema: z.object({
    orderId: z.string(),
  }),
});
```

You may also set **`inputJsonSchema`** manually without Zod when you only need documentation/agent hints.

### bindAction / unbindAction

Associates an action id with an async (or sync) handler invoked after policy passes and optional input validation succeeds.

```typescript
import { bindAction } from "@synqel/sdk";

bindAction("submit_order", async (_ctx, input) => {
  const { orderId } = input as { orderId: string };
  return { ok: true, orderId };
});
```

Without a bound handler, `executeAction` resolves with `{ ok: false, message: "No handler bound …" }`.

### executeAction

Runs the full pipeline for an action on the **global** registry: emit attempt → evaluate policy → validate optional Zod input → invoke handler → emit result.

```typescript
import { executeAction } from "@synqel/sdk";

await executeAction(
  "submit_order",
  { actor: "human", roles: ["customer"] },
  { orderId: "ord_1" },
  { sessionId: optionalCorrelationId },
);
```

### registerCapability / registerWorkflow

Unchanged — see protocol docs. Workflows describe ordered action ids; a dedicated workflow orchestrator may emit additional runtime events in the future.

## SemanticRegistry

Access via `getSemanticRegistry()`.

Key methods:

| Method | Purpose |
|--------|---------|
| `registerEntity` / `getEntity` / `updateEntity` / `removeEntity` | Entity CRUD |
| `registerAction` / `getAction` | Action definitions (+ optional Zod `inputSchema` on input object) |
| `bindAction` / `unbindAction` | Handler wiring |
| `executeAction` | Async execution pipeline |
| `startSession` / `endSession` | Emit `session:started` / `session:ended` with generated ids |
| `registerCapability` / `registerWorkflow` | Capability merge / workflow registration |
| `getSnapshot` / `getVersion` | Agent-visible surface + mutation counter |
| `reset` | Clears registry including handlers and Zod input maps |

## Snapshot serialization

Serializable envelope for HTTP (`GET /.synqel/snapshot`), MCP, or logs:

```typescript
import {
  createSnapshotEnvelope,
  serializeSnapshotEnvelope,
  synqelSnapshotJsonResponse,
  getSemanticRegistry,
} from "@synqel/sdk";

const registry = getSemanticRegistry();
serializeSnapshotEnvelope(registry); // string JSON

// Next.js App Router route handler example:
export function GET() {
  return synqelSnapshotJsonResponse(getSemanticRegistry());
}
```

## SemanticEventBus

Pub/sub event bus attached to every registry at `registry.bus`.

```typescript
const unsubscribe = registry.bus.subscribe((event) => {
  console.log(event.type, event);
});

unsubscribe();
```

## evaluatePolicy

Evaluates a chain of policy rules. See [Policy](./policy.md).

```typescript
import { evaluatePolicy } from "@synqel/sdk";

const decision = evaluatePolicy(
  { actor: "agent", roles: ["viewer"] },
  { id: "delete_item", intent: "mutation", deterministic: true },
);
```

## React hooks

Import from `@synqel/sdk/react` — requires `"use client"`.

### useSemanticRuntime

Returns `{ registry, snapshot, executeAction }`. Snapshot is reactive via `useSyncExternalStore`. **`executeAction` returns a `Promise`** (policy → validation → handler).

```typescript
import { useSemanticRuntime } from "@synqel/sdk/react";

function MyComponent() {
  const { snapshot, executeAction } = useSemanticRuntime();
  // snapshot updates reactively on registry changes
}
```

### useSemanticEvents

Subscribes to all registry events via `useEffect`.

```typescript
import { useSemanticEvents } from "@synqel/sdk/react";
import { useCallback } from "react";

function EventLogger() {
  const handleEvent = useCallback((event) => {
    console.log(event);
  }, []);

  useSemanticEvents(handleEvent);
  return null;
}
```

## MCP integration

See **`@synqel/mcp`** in this monorepo (`packages/mcp`). It registers MCP tools that wrap `serializeSnapshotEnvelope` and `registry.executeAction` so Claude Desktop, Cursor, or other MCP hosts can consume Synqel without a custom wire protocol.
