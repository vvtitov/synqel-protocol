# Examples

> Complete integration examples for common patterns.

## E-commerce product page

```typescript
import {
  registerEntity,
  registerAction,
  registerCapability,
  registerWorkflow,
} from "@synqel/sdk";

registerEntity({
  id: "product_123",
  type: "product",
  metadata: { name: "Wireless Headphones", price: 299, currency: "USD" },
});

registerAction({ id: "add_to_cart", intent: "mutation", deterministic: true });
registerAction({ id: "view_details", intent: "query", deterministic: true });
registerAction({ id: "go_checkout", intent: "navigation", deterministic: true });

registerCapability({ canSearch: true, canCheckout: true, canNavigate: true });

registerWorkflow({
  id: "checkout_flow",
  steps: ["add_to_cart", "go_checkout", "confirm_order"],
});
```

### What the AI receives

```json
{
  "entities": [
    {
      "id": "product_123",
      "type": "product",
      "metadata": { "name": "Wireless Headphones", "price": 299, "currency": "USD" }
    }
  ],
  "actions": [
    { "id": "add_to_cart", "intent": "mutation", "deterministic": true },
    { "id": "view_details", "intent": "query", "deterministic": true },
    { "id": "go_checkout", "intent": "navigation", "deterministic": true }
  ],
  "capabilities": { "canSearch": true, "canCheckout": true, "canNavigate": true },
  "workflows": [
    { "id": "checkout_flow", "steps": ["add_to_cart", "go_checkout", "confirm_order"] }
  ]
}
```

## Multi-step form

```typescript
import { registerEntity, registerAction, registerWorkflow } from "@synqel/sdk";

registerEntity({
  id: "shipping_form",
  type: "form",
  metadata: { purpose: "collect_shipping_address", totalSteps: 4, currentStep: 1 },
});

registerAction({ id: "fill_name", intent: "mutation", deterministic: true });
registerAction({ id: "fill_address", intent: "mutation", deterministic: true });
registerAction({ id: "fill_payment", intent: "mutation", deterministic: true });
registerAction({ id: "submit_form", intent: "mutation", deterministic: true });
registerAction({ id: "go_back", intent: "navigation", deterministic: true });

registerWorkflow({
  id: "form_completion",
  steps: ["fill_name", "fill_address", "fill_payment", "submit_form"],
});
```

The AI agent sees the form entity with step metadata and the workflow definition. It can guide the user: *"This is step 2 of 4. Please fill in your shipping address."*

## Dashboard navigation

```typescript
import { registerEntity, registerAction, registerCapability } from "@synqel/sdk";

registerEntity({
  id: "section_overview",
  type: "section",
  metadata: { label: "Overview", path: "/dashboard" },
});
registerEntity({
  id: "section_analytics",
  type: "section",
  metadata: { label: "Analytics", path: "/dashboard/analytics" },
});
registerEntity({
  id: "section_settings",
  type: "section",
  metadata: { label: "Settings", path: "/dashboard/settings" },
});

registerAction({ id: "navigate_to", intent: "navigation", deterministic: true });
registerCapability({ canNavigate: true });
```

When a user says *"Take me to analytics"*, the AI agent reads the snapshot, finds the matching section entity, and executes the navigation action. Policy evaluation allows navigation for all actor types.

## Checkout with parameters, handlers, and MCP

Use Zod **`inputSchema`** so agents see **`inputJsonSchema`**, bind a real handler, and optionally expose the same registry over MCP:

```typescript
import {
  registerEntity,
  registerAction,
  bindAction,
  registerWorkflow,
  getSemanticRegistry,
} from "@synqel/sdk";
import { z } from "zod";
import { connectSynqelMcpStdio } from "@synqel/mcp";

registerEntity({
  id: "checkout_cart",
  type: "cart",
  metadata: { currency: "USD" },
});

registerAction({
  id: "submit_checkout",
  intent: "mutation",
  inputSchema: z.object({
    cartId: z.string(),
  }),
});

bindAction("submit_checkout", async (_ctx, input) => {
  const { cartId } = input as { cartId: string };
  return { paid: true, cartId };
});

registerWorkflow({
  id: "checkout_flow",
  steps: ["submit_checkout"],
});

async function startMcpBridge() {
  await connectSynqelMcpStdio(getSemanticRegistry(), {
    defaultPolicyContext: { actor: "agent", roles: ["admin"] },
  });
}

void startMcpBridge();
```

REST-style exposure without MCP:

```typescript
import { synqelSnapshotJsonResponse, getSemanticRegistry } from "@synqel/sdk";

export function GET() {
  return synqelSnapshotJsonResponse(getSemanticRegistry());
}
```
