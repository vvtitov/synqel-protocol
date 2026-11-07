# SDK Reference

> `@synqel/sdk`: the semantic runtime SDK for the Synqel Protocol.

Synqel describes **what your application means** (entities, actions, workflows) and **what each actor may do** (policy). The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) is one way for agents to reach that surface: the sibling package `@synqel/mcp` exposes it as stdio MCP tools (see [MCP adapter (@synqel/mcp)](#mcp-adapter-synqelmcp)). Synqel stays portable, so REST, WebSockets, or in-process hooks remain valid transports.

| Import | Contents |
|---|---|
| `@synqel/sdk` | Registration functions, `executeAction`, `SemanticRegistry`, `SemanticEventBus`, snapshot helpers, `evaluatePolicy`, event taxonomy, types |
| `@synqel/sdk/react` | `useSemanticRuntime`, `useSemanticEvents` |
| `@synqel/mcp` | `connectSynqelMcpStdio`, `attachSynqelRegistryToMcpServer` |

## Installation

```bash
bun add @synqel/sdk zod
```

`zod` is a peer dependency. The SDK bundles `zod-to-json-schema` so optional Zod action inputs become portable JSON Schema in the snapshot.

React (18 or later) is optional. You only need it for `@synqel/sdk/react`.

The top-level functions below (`registerEntity`, `registerAction`, `bindAction`, `executeAction`, and so on) all operate on the global registry returned by `getSemanticRegistry()`. Each one has a method of the same name on [SemanticRegistry](#semanticregistry).

## registerEntity

Validates the input against the entity Zod schema and registers it in the global registry. Returns the parsed `SemanticEntity`. Registering an existing `id` replaces it. Emits `entity:registered`.

```typescript
import { registerEntity } from "@synqel/sdk";

const entity = registerEntity({
  id: "product_123",
  type: "product",
  metadata: { price: 299, category: "electronics" },
});
// metadata defaults to {} if omitted
```

## registerAction

Validates and registers a semantic action. Returns the stored `SemanticAction`. `deterministic` defaults to `true`. Emits `action:registered`.

Optional `inputSchema` (a Zod schema) is accepted alongside the protocol fields. It is not stored as-is: the SDK uses it to fill `inputJsonSchema` on the stored action and to validate payloads during [executeAction](#executeaction).

```typescript
import { registerAction } from "@synqel/sdk";
import { z } from "zod";

// Minimal action
registerAction({
  id: "go_home",
  intent: "navigation",
});

// With Zod input: derives inputJsonSchema and validates on executeAction
registerAction({
  id: "add_to_cart",
  intent: "mutation",
  description: "Add a product to the cart",
  inputSchema: z.object({
    sku: z.string(),
    qty: z.number().int().positive(),
  }),
});
```

You may also set `inputJsonSchema` by hand, without Zod, when you only need hints for agents and documentation. In that case `executeAction` does not validate the input.

## bindAction

Associates an action id with a sync or async handler. The handler runs after policy passes and optional input validation succeeds. It receives the execution context (the policy context plus `sessionId` when one was passed) and the validated input. Whatever it returns becomes `data` in the result.

```typescript
import { bindAction, registerAction } from "@synqel/sdk";

registerAction({ id: "ping", intent: "query" });

bindAction("ping", async (ctx, input) => {
  return { pong: true, actor: ctx.actor, echo: input };
});
```

Binding the same id again replaces the handler. `unbindAction(id)` removes it and returns `true` if a handler was bound. Without a bound handler, `executeAction` resolves with `{ ok: false, code: "unbound" }`.

## executeAction

Runs the full pipeline for an action on the global registry:

1. Look up the action. If it is missing, resolve with `not_found`.
2. Emit `action:attempt`.
3. Evaluate policy with the built-in default rule and emit `policy:evaluated` (plus `policy:denied` on denial).
4. Validate the input with the action's Zod `inputSchema`, when it has one.
5. Invoke the bound handler.
6. Emit `action:executed` on success, then `action:result` in every case.

```typescript
import {
  executeAction,
  registerAction,
  bindAction,
  getSemanticRegistry,
} from "@synqel/sdk";
import { z } from "zod";

registerAction({
  id: "submit_order",
  intent: "mutation",
  inputSchema: z.object({ orderId: z.string() }),
});
bindAction("submit_order", async (_ctx, input) => {
  const { orderId } = input as { orderId: string };
  return { orderId, status: "submitted" };
});

const registry = getSemanticRegistry();
const sessionId = registry.startSession();

const result = await executeAction(
  "submit_order",
  { actor: "human", roles: ["customer"] },
  { orderId: "ord_1" },
  { sessionId },
);

if (result.ok) {
  console.log(result.data); // { orderId: "ord_1", status: "submitted" }
} else {
  console.error(result.code, result.message);
}

registry.endSession(sessionId);
```

The optional fourth argument carries a `sessionId`. It is added to the `action:attempt` event and to the handler context.

### Result

`executeAction` resolves with an `ExecuteActionResult`, a discriminated union on `ok`. It never rejects for the cases below.

```typescript
type ExecuteActionResult =
  | { ok: true; data?: unknown }                               // ExecuteActionSuccess
  | { ok: false; code: ExecuteActionErrorCode; message: string }; // ExecuteActionFailure
```

Check `ok` before reading the other fields; TypeScript narrows the type for you. Successful results carry no `code` or `message`, and `data` is omitted when the handler returned `undefined`. On failure, `code` tells why:

| `code` | When |
|--------|------|
| `not_found` | No action is registered with that id |
| `policy_denied` | A policy rule rejected the actor; `message` holds the reason |
| `invalid_input` | Input failed the action's Zod schema; `message` holds the Zod error |
| `unbound` | The action has no bound handler |
| `handler_error` | The handler threw; `message` holds the thrown `Error`'s message, or "Action handler threw a non-Error value." for other thrown values |

`executeAction` evaluates only the built-in default policy rule. To apply custom rules, see [Applying custom rules](./policy.md#applying-custom-rules).

## Snapshot serialization

The SDK wraps the registry snapshot in the stable `synqel.snapshot.v1` envelope, which adds the `registryVersion` mutation counter. Use it for HTTP (for example `GET /.synqel/snapshot`), MCP, or logs. See [Registry snapshot](./protocol.md#registry-snapshot) for the shape.

| Function | Returns |
|---|---|
| `createSnapshotEnvelope(registry)` | The envelope object (`SynqelSnapshotEnvelope`) |
| `serializeSnapshotEnvelope(registry)` | The envelope as a JSON string |
| `synqelSnapshotJsonResponse(registry, init?)` | A `Response` with the JSON body and `content-type: application/json; charset=utf-8` |

```typescript title="route.ts"
import {
  createSnapshotEnvelope,
  serializeSnapshotEnvelope,
  synqelSnapshotJsonResponse,
  getSemanticRegistry,
} from "@synqel/sdk";

const registry = getSemanticRegistry();

const envelope = createSnapshotEnvelope(registry); // { format, registryVersion, snapshot }
const json = serializeSnapshotEnvelope(registry);  // string

// Next.js App Router route handler
export function GET() {
  return synqelSnapshotJsonResponse(getSemanticRegistry());
}
```

`synqelSnapshotJsonResponse` passes `init` to the `Response` constructor and merges `init.headers` over the default content type. Pass headers as a plain object.

## registerCapability

Registers application-level capabilities. Each call merges into the existing profile and returns the merged `CapabilityProfile`. Emits `capability:registered` with the merged profile.

```typescript
import { registerCapability } from "@synqel/sdk";

registerCapability({ canSearch: true, canCheckout: true });
// capabilities merge, so you can call this multiple times
registerCapability({ canNavigate: true });
// profile is now { canSearch: true, canCheckout: true, canNavigate: true }
```

## registerWorkflow

Registers a named workflow and returns it. Emits `workflow:registered`.

```typescript
import { registerWorkflow } from "@synqel/sdk";

const workflow = registerWorkflow({
  id: "checkout_flow",
  steps: ["add_to_cart", "fill_shipping", "fill_payment", "confirm_order"],
});
// steps must have at least 1 entry, each a non-empty string
```

The SDK stores workflows as descriptions only. It does not run them, so it never emits the `workflow:started`, `workflow:step`, `workflow:completed`, or `workflow:failed` events. See [Event Taxonomy](./events.md).

## SemanticRegistry

The core registry: entity CRUD, action registration, handler binding, execution, sessions, snapshot, and version. `getSemanticRegistry()` returns the global singleton that the top-level functions and React hooks use. You can also create an isolated instance with `new SemanticRegistry()` and pass it to the snapshot helpers or the MCP adapter.

| Method | Purpose |
|--------|---------|
| `registerEntity` / `getEntity` / `updateEntity` / `removeEntity` | Entity CRUD (`getEntity` emits `entity:queried` when found; `removeEntity` returns `true` if it removed one) |
| `registerAction` / `getAction` | Action definitions, with optional Zod `inputSchema` on the input object |
| `bindAction` / `unbindAction` | Handler wiring |
| `executeAction` | Async execution pipeline (see [executeAction](#executeaction)) |
| `startSession` / `endSession` | Emit `session:started` / `session:ended`; `startSession` returns a generated id |
| `registerCapability` / `registerWorkflow` / `getWorkflow` | Capability merge, workflow registration and lookup |
| `getSnapshot` / `getVersion` | Agent-visible surface and mutation counter |
| `reset` | Clears entities, actions, capabilities, workflows, handlers, and Zod input schemas; sets the version to 0 |
| `bus` | The registry's [SemanticEventBus](#semanticeventbus) |

```typescript
import { getSemanticRegistry } from "@synqel/sdk";

const registry = getSemanticRegistry();

registry.registerEntity({ id: "e1", type: "product" });
registry.registerAction({ id: "a1", intent: "query" });
registry.bindAction("a1", async () => "done");

await registry.executeAction("a1", { actor: "human", roles: [] });

const sid = registry.startSession();
registry.endSession(sid);

const snapshot = registry.getSnapshot();
const version = registry.getVersion();

registry.updateEntity({ id: "e1", type: "product", metadata: { price: 399 } });
registry.removeEntity("e1");

registry.reset();
```

## SemanticEventBus

Pub/sub event bus attached to every registry at `registry.bus`. `subscribe` returns an unsubscribe function. Listeners receive every `RuntimeEvent`; see [Event Taxonomy](./events.md) for the full list.

```typescript
import { getSemanticRegistry } from "@synqel/sdk";

const registry = getSemanticRegistry();

const unsubscribe = registry.bus.subscribe((event) => {
  console.log(event.type, event);
});

registry.registerEntity({ id: "e1", type: "product" });

unsubscribe();
```

The bus also exposes `emit(event)`, so a host can publish events the SDK does not emit itself, such as intent events.

## evaluatePolicy

Evaluates a chain of policy rules and returns a `PolicyDecision`. Custom rules run first, in array order; the bundled default rule runs last. The first denial wins. See [Policy](./policy.md).

```typescript
import { evaluatePolicy } from "@synqel/sdk";
import type { PolicyContext, PolicyRule, SemanticAction } from "@synqel/sdk";

const ctx: PolicyContext = {
  actor: "agent",
  roles: ["viewer"],
};

const action: SemanticAction = {
  id: "delete_item",
  intent: "mutation",
  deterministic: true,
};

const decision = evaluatePolicy(ctx, action);
// { allowed: false, reason: "Agents cannot execute mutation actions without the admin role." }

const ownerOnly: PolicyRule = (ruleCtx, ruleAction) => {
  if (ruleAction.id === "delete_account" && !ruleCtx.roles.includes("owner")) {
    return { allowed: false, reason: "Only owners can delete accounts." };
  }
  return null;
};

evaluatePolicy(ctx, action, [ownerOnly]);
```

Calling `evaluatePolicy` directly emits no events. Only `executeAction` emits `policy:evaluated` and `policy:denied`.

## React hooks

Import from `@synqel/sdk/react`. The module is marked `"use client"`, so use the hooks in client components.

### useSemanticRuntime

Returns `{ registry, snapshot, executeAction }` for the global registry. `snapshot` is reactive through `useSyncExternalStore` and updates on every registry event. `executeAction` has the same signature as the top-level function and returns a `Promise<ExecuteActionResult>`: use `void executeAction(...)` in sync handlers, or `await` it in async flows.

```tsx
"use client";

import { useSemanticRuntime } from "@synqel/sdk/react";

function MyComponent() {
  const { snapshot, executeAction } = useSemanticRuntime();

  const handleClick = () => {
    void executeAction(
      "submit_form",
      { actor: "human", roles: ["customer"] },
      { formId: "checkout" },
    );
  };

  return (
    <button type="button" onClick={handleClick}>
      Submit ({snapshot.actions.length} actions)
    </button>
  );
}
```

### useSemanticEvents

Subscribes a callback to all registry events with `useEffect` and unsubscribes on unmount. Pass a stable callback (for example with `useCallback`), otherwise the hook resubscribes on every render.

```tsx
"use client";

import { useCallback } from "react";
import { useSemanticEvents } from "@synqel/sdk/react";
import type { RuntimeEvent } from "@synqel/sdk";

function EventLogger() {
  const handleEvent = useCallback((event: RuntimeEvent) => {
    if (event.type === "policy:denied") {
      console.warn("Policy denied:", event.reason);
    }
    if (event.type === "action:executed") {
      console.log("Action executed:", event.actionId);
    }
  }, []);

  useSemanticEvents(handleEvent);

  return null;
}
```

## MCP adapter (@synqel/mcp)

Sibling package in this monorepo ([packages/mcp](https://github.com/vvtitov/synqel-protocol/tree/main/packages/mcp)). It registers MCP tools that wrap `serializeSnapshotEnvelope` and `registry.executeAction`, so Claude Desktop, Cursor, or other MCP hosts connect over stdio without a custom wire protocol.

```bash
bun add @synqel/mcp @synqel/sdk zod
```

| Tool | Purpose |
|------|--------|
| `synqel_get_snapshot` | Returns the `synqel.snapshot.v1` envelope as JSON text |
| `synqel_execute_action` | Takes `actionId`, optional `input` (an object), optional `policyContext`, and optional `sessionId`; runs policy, optional Zod validation, and the bound handler |

```typescript title="mcp-server.ts"
import { getSemanticRegistry, registerAction, bindAction } from "@synqel/sdk";
import { connectSynqelMcpStdio } from "@synqel/mcp";

registerAction({ id: "ping", intent: "query" });
bindAction("ping", async () => ({ pong: true }));

await connectSynqelMcpStdio(getSemanticRegistry(), {
  defaultPolicyContext: { actor: "agent", roles: ["admin"] },
});
```

`connectSynqelMcpStdio(registry, options?)` creates the server, connects a stdio transport, and returns the `McpServer`. To add the tools to a server you already own, call `attachSynqelRegistryToMcpServer(server, registry, options?)`.

| Option | Default | Effect |
|--------|---------|--------|
| `defaultPolicyContext` | `{ actor: "agent", roles: [] }` | Policy context used when `synqel_execute_action` omits `policyContext` |
| `exposeHandlerErrors` | `false` | Return a throwing handler's own message to the agent instead of a generic one |

When an action fails, `synqel_execute_action` returns an MCP tool error (`isError: true`) whose text is the Synqel result as JSON, including its `code`:

```json
{ "ok": false, "code": "policy_denied", "message": "Agents cannot execute mutation actions without the admin role." }
```

For `handler_error` the agent sees `"Action handler failed."` unless `exposeHandlerErrors` is `true`, so internal details stay out of the agent's context. The original message is still emitted on the registry event bus (`action:result`) for your logs. Missing or malformed tool arguments, such as no `actionId`, are rejected by the MCP SDK's own input validation, also as `isError: true`.
