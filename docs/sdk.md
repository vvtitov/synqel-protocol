# SDK Reference

> `@synqel/sdk` — Semantic runtime SDK for the Synqel Protocol.

## Installation

```bash
bun add @synqel/sdk
# or
npm install @synqel/sdk
```

The SDK requires `zod` as a peer dependency. React is optional — only needed for `@synqel/sdk/react`.

## Convenience functions

### registerEntity

Validates input against the entity Zod schema and registers it in the global registry. Returns the parsed `SemanticEntity`. Emits `entity:registered`.

```typescript
import { registerEntity } from "@synqel/sdk";

const entity = registerEntity({
  id: "product_123",
  type: "product",
  metadata: { price: 299 },
});
```

### registerAction

Validates and registers a semantic action. `deterministic` defaults to `true`. Emits `action:registered`.

```typescript
import { registerAction } from "@synqel/sdk";

const action = registerAction({
  id: "add_to_cart",
  intent: "mutation",
  deterministic: true,
});
```

### registerCapability

Registers application-level capabilities. Merges incrementally. Emits `capability:registered`.

```typescript
import { registerCapability } from "@synqel/sdk";

registerCapability({ canSearch: true, canCheckout: true });
```

### registerWorkflow

Registers a named workflow with ordered steps. Steps must have at least 1 entry. Emits `workflow:registered`.

```typescript
import { registerWorkflow } from "@synqel/sdk";

const workflow = registerWorkflow({
  id: "checkout_flow",
  steps: ["add_to_cart", "fill_shipping", "confirm_order"],
});
```

## SemanticRegistry

The core class holding all registered data. Access via `getSemanticRegistry()`.

```typescript
import { getSemanticRegistry } from "@synqel/sdk";

const registry = getSemanticRegistry();

registry.registerEntity({ id: "e1", type: "product" });
registry.getEntity("e1");
registry.updateEntity({ id: "e1", type: "product", metadata: { price: 399 } });
registry.removeEntity("e1");

const snapshot = registry.getSnapshot();
const version = registry.getVersion();
registry.reset();
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

Evaluates a chain of policy rules. See [Policy](./policy.md) for full documentation.

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

Returns `{ registry, snapshot, executeAction }`. Snapshot is reactive via `useSyncExternalStore`.

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
