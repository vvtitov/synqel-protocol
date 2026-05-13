# @synqel/sdk

> Semantic runtime SDK for the Synqel Protocol — the open standard for AI-navigable web applications.

## Install

```bash
bun add @synqel/sdk
# or
npm install @synqel/sdk
```

## Usage

```typescript
import {
  registerEntity,
  registerAction,
  registerCapability,
  registerWorkflow,
  getSemanticRegistry,
} from "@synqel/sdk";

registerEntity({
  id: "product_123",
  type: "product",
  metadata: { price: 299 },
});

registerAction({
  id: "add_to_cart",
  intent: "mutation",
  deterministic: true,
});

registerCapability({ canSearch: true, canCheckout: true });

registerWorkflow({
  id: "checkout_flow",
  steps: ["add_to_cart", "confirm_order"],
});

const snapshot = getSemanticRegistry().getSnapshot();
```

## React Integration

```typescript
import { useSemanticRuntime, useSemanticEvents } from "@synqel/sdk/react";

function MyComponent() {
  const { snapshot, executeAction } = useSemanticRuntime();

  useSemanticEvents((event) => {
    console.log("Semantic event:", event);
  });

  return (
    <button
      onClick={() =>
        executeAction("add_to_cart", { actor: "human", roles: ["customer"] })
      }
    >
      Add to Cart
    </button>
  );
}
```

## License

MIT
