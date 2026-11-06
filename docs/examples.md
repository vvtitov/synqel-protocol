# Examples

> Complete integration examples for common patterns.

Each example registers a semantic surface, then shows what an agent sees or does with it. Synqel stays the contract; the transport (React, HTTP, MCP) is your choice.

| Example | Shows |
|---|---|
| [E-commerce product page](#e-commerce-product-page) | Entities, actions, capabilities, a workflow, the snapshot envelope, a React component |
| [Multi-step form](#multi-step-form) | Step metadata on an entity and a completion workflow |
| [Dashboard navigation](#dashboard-navigation) | A navigation action with a Zod input, a handler, and navigation driven by events |
| [Agents, HTTP, and MCP](#agents-http-and-mcp) | Serving the snapshot over HTTP and running an MCP stdio bridge |

## E-commerce product page

Register a product entity with price metadata, define add-to-cart and checkout actions, declare capabilities, and wire up a checkout workflow. This is the most common Synqel integration pattern.

```typescript title="Registration"
import {
  registerEntity,
  registerAction,
  bindAction,
  registerCapability,
  registerWorkflow,
} from "@synqel/sdk";

// The product entity, with price metadata
registerEntity({
  id: "product_123",
  type: "product",
  metadata: { name: "Wireless Headphones", price: 299, currency: "USD" },
});

// Available actions, classified by intent
registerAction({ id: "add_to_cart", intent: "mutation", deterministic: true });
registerAction({ id: "view_details", intent: "query", deterministic: true });
registerAction({ id: "go_checkout", intent: "navigation", deterministic: true });
registerAction({ id: "confirm_order", intent: "mutation", deterministic: true });

// A handler makes add_to_cart executable; actions without one resolve with code "unbound"
bindAction("add_to_cart", async () => ({ added: "product_123" }));

// What this app can do
registerCapability({ canSearch: true, canCheckout: true, canNavigate: true });

// The checkout path
registerWorkflow({
  id: "checkout_flow",
  steps: ["add_to_cart", "go_checkout", "confirm_order"],
});
```

### What the AI receives

The agent receives the `synqel.snapshot.v1` envelope. `registryVersion` is 7 because the code above made seven registrations; binding a handler does not change it.

```json title="Snapshot envelope"
{
  "format": "synqel.snapshot.v1",
  "registryVersion": 7,
  "snapshot": {
    "entities": [
      {
        "id": "product_123",
        "type": "product",
        "metadata": {
          "name": "Wireless Headphones",
          "price": 299,
          "currency": "USD"
        }
      }
    ],
    "actions": [
      { "id": "add_to_cart", "intent": "mutation", "deterministic": true },
      { "id": "view_details", "intent": "query", "deterministic": true },
      { "id": "go_checkout", "intent": "navigation", "deterministic": true },
      { "id": "confirm_order", "intent": "mutation", "deterministic": true }
    ],
    "capabilities": {
      "canSearch": true,
      "canCheckout": true,
      "canNavigate": true
    },
    "workflows": [
      {
        "id": "checkout_flow",
        "steps": ["add_to_cart", "go_checkout", "confirm_order"]
      }
    ]
  }
}
```

### React component

```tsx title="ProductPage.tsx"
"use client";

import { useSemanticRuntime } from "@synqel/sdk/react";

function ProductPage() {
  const { snapshot, executeAction } = useSemanticRuntime();

  const product = snapshot.entities.find((e) => e.id === "product_123");

  return (
    <div>
      <h1>{product?.metadata.name as string}</h1>
      <p>${product?.metadata.price as number}</p>
      <button
        type="button"
        onClick={() =>
          void executeAction("add_to_cart", { actor: "human", roles: ["customer"] })
        }
      >
        Add to Cart
      </button>
    </div>
  );
}
```

## Multi-step form

Model a multi-step form as an entity with step metadata, register each field-filling action, and define a workflow that gives the AI agent a clear path through the form.

```typescript title="Registration"
import { registerEntity, registerAction, registerWorkflow } from "@synqel/sdk";

// The form as an entity
registerEntity({
  id: "shipping_form",
  type: "form",
  metadata: {
    purpose: "collect_shipping_address",
    totalSteps: 4,
    currentStep: 1,
  },
});

// Form actions
registerAction({ id: "fill_name", intent: "mutation", deterministic: true });
registerAction({ id: "fill_address", intent: "mutation", deterministic: true });
registerAction({ id: "fill_payment", intent: "mutation", deterministic: true });
registerAction({ id: "submit_form", intent: "mutation", deterministic: true });
registerAction({ id: "go_back", intent: "navigation", deterministic: true });

// The completion workflow
registerWorkflow({
  id: "form_completion",
  steps: ["fill_name", "fill_address", "fill_payment", "submit_form"],
});
```

The agent sees the form entity with its step metadata and the workflow definition:

```text title="How the AI agent reasons"
"This is a 4-step form. The user is on step 1.
 The next action is fill_name (mutation).
 The workflow is: fill_name → fill_address → fill_payment → submit_form.
 I can guide: 'Please enter your name. This is step 1 of 4.'"

"go_back is available as a navigation action.
 I should offer it if the user wants to return to the previous step."
```

The fill actions are mutations. Under the [default policy rule](./policy.md#default-rule), an agent can only execute them with the `admin` role; without it, the agent guides and the user acts.

## Dashboard navigation

Register dashboard sections as entities with path metadata, define one navigation action that takes the target section as input, and let AI agents resolve natural-language navigation requests against the semantic surface.

```typescript title="Registration"
import {
  registerEntity,
  registerAction,
  bindAction,
  registerCapability,
  getSemanticRegistry,
} from "@synqel/sdk";
import { z } from "zod";

// Each dashboard section as an entity
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

// One navigation action; the input names the target section
registerAction({
  id: "navigate_to",
  intent: "navigation",
  deterministic: true,
  inputSchema: z.object({ sectionId: z.string() }),
});

// The handler resolves the section to its path
bindAction("navigate_to", (_ctx, input) => {
  const { sectionId } = input as { sectionId: string };
  const section = getSemanticRegistry().getEntity(sectionId);
  if (!section) {
    throw new Error(`Unknown section "${sectionId}".`);
  }
  return { path: section.metadata.path as string };
});

registerCapability({ canNavigate: true });
```

```text title="AI agent interaction"
User: "Take me to analytics"

Agent reads the snapshot and finds:
  entity  { id: "section_analytics", type: "section", metadata: { label: "Analytics", path: "/dashboard/analytics" } }
  action  { id: "navigate_to", intent: "navigation", inputJsonSchema: { properties: { sectionId: { type: "string" } }, ... } }

Agent calls:  executeAction("navigate_to", { actor: "agent", roles: ["viewer"] }, { sectionId: "section_analytics" })
Policy:       the default rule only restricts mutations → { allowed: true }
Result:       { ok: true, data: { path: "/dashboard/analytics" } }
Events:       action:attempt → policy:evaluated → entity:queried (from getEntity in the handler) → action:executed → action:result
```

The component below navigates on every successful `navigate_to` result, so the same code path serves a click and an agent request. `action:result` carries the handler's `data`.

```tsx title="Dashboard.tsx"
"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSemanticRuntime, useSemanticEvents } from "@synqel/sdk/react";
import type { RuntimeEvent } from "@synqel/sdk";

function Dashboard() {
  const router = useRouter();
  const { snapshot, executeAction } = useSemanticRuntime();

  const sections = snapshot.entities.filter((e) => e.type === "section");

  const handleEvent = useCallback(
    (event: RuntimeEvent) => {
      if (event.type === "action:result" && event.actionId === "navigate_to" && event.ok) {
        const { path } = event.data as { path: string };
        router.push(path);
      }
    },
    [router],
  );

  useSemanticEvents(handleEvent);

  return (
    <nav>
      {sections.map((section) => (
        <button
          type="button"
          key={section.id}
          onClick={() =>
            void executeAction(
              "navigate_to",
              { actor: "human", roles: ["viewer"] },
              { sectionId: section.id },
            )
          }
        >
          {section.metadata.label as string}
        </button>
      ))}
    </nav>
  );
}
```

## Agents, HTTP, and MCP

The same registry serves every transport. Serve the snapshot envelope as JSON over HTTP for remote agents, or run `@synqel/mcp` so Claude Desktop, Cursor, and other MCP hosts get the `synqel_get_snapshot` and `synqel_execute_action` tools.

### HTTP snapshot

```typescript title="Next.js route handler: snapshot envelope"
import { synqelSnapshotJsonResponse, getSemanticRegistry } from "@synqel/sdk";

export function GET() {
  return synqelSnapshotJsonResponse(getSemanticRegistry());
}
```

### MCP stdio bridge

Use a Zod `inputSchema` so agents see `inputJsonSchema`, bind a real handler, and expose the registry over MCP:

```typescript title="mcp-server.ts"
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
  inputSchema: z.object({ cartId: z.string() }),
});

bindAction("submit_checkout", async (_ctx, input) => {
  const { cartId } = input as { cartId: string };
  return { paid: true, cartId };
});

registerWorkflow({
  id: "checkout_flow",
  steps: ["submit_checkout"],
});

async function main() {
  // submit_checkout is a mutation, so the agent needs the admin role
  await connectSynqelMcpStdio(getSemanticRegistry(), {
    defaultPolicyContext: { actor: "agent", roles: ["admin"] },
  });
}

void main();
```

An agent calls `synqel_execute_action` with `{ "actionId": "submit_checkout", "input": { "cartId": "cart_1" } }` and receives the Synqel result as JSON text:

```json title="Tool result"
{
  "ok": true,
  "data": {
    "paid": true,
    "cartId": "cart_1"
  }
}
```

Without the `admin` role in `defaultPolicyContext` (or in the call's own `policyContext`), the same call returns an MCP tool error (`isError: true`) with `"code": "policy_denied"`. See [MCP adapter (@synqel/mcp)](./sdk.md#mcp-adapter-synqelmcp) for the options and error handling.
