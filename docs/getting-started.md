# Getting Started

> Describe your application to AI agents in a few lines of TypeScript.

Synqel defines how your application describes itself to AI agents: entities, actions (with optional JSON Schema inputs), workflows, policy, and events. It complements the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP): Synqel is the semantic contract, and `@synqel/mcp` exposes that contract as standard tools when you want stdio MCP hosts.

## Installation

```bash title="Install"
bun add @synqel/sdk zod
# optional: MCP stdio bridge for Claude Desktop, Cursor, and other MCP hosts
bun add @synqel/mcp
```

The SDK requires `zod` as a peer dependency and bundles `zod-to-json-schema`, so optional Zod inputs become portable JSON Schema in the snapshot. React is optional; you only need it if you use `@synqel/sdk/react`.

## Quick start

Register entities and actions, attach Zod input schemas when agents need structured parameters, bind handlers for real execution, and expose the same snapshot everywhere: UI, HTTP, or MCP.

```typescript title="semantic.ts"
import {
  registerEntity,
  registerAction,
  bindAction,
  registerWorkflow,
} from "@synqel/sdk";
import { z } from "zod";

registerEntity({
  id: "checkout_form",
  type: "form",
  metadata: { purpose: "complete_purchase" },
});

registerAction({ id: "fill_shipping", intent: "mutation" });
registerAction({ id: "fill_payment", intent: "mutation" });
registerAction({
  id: "submit_checkout",
  intent: "mutation",
  deterministic: true,
  inputSchema: z.object({
    orderId: z.string(),
  }),
});

bindAction("submit_checkout", async (_ctx, input) => {
  const { orderId } = input as { orderId: string };
  return { confirmed: true, orderId };
});

registerWorkflow({
  id: "checkout_flow",
  steps: ["fill_shipping", "fill_payment", "submit_checkout"],
});
```

```tsx title="CheckoutPage.tsx"
"use client";

import { useSemanticRuntime } from "@synqel/sdk/react";
import "./semantic";

function CheckoutPage() {
  const { executeAction } = useSemanticRuntime();

  const completePurchase = async () => {
    const result = await executeAction(
      "submit_checkout",
      { actor: "human", roles: ["customer"] },
      { orderId: "ord_123" },
    );
    if (!result.ok) {
      console.error(result.code, result.message);
    }
  };

  return (
    <button type="button" onClick={() => void completePurchase()}>
      Complete Purchase
    </button>
  );
}
```

`executeAction` resolves with `{ ok: true, data? }` or `{ ok: false, code, message }`. See [executeAction](./sdk.md#executeaction) for the failure codes.

## What the AI sees

For transport and caching, serialize the registry with the stable `synqel.snapshot.v1` envelope. It includes `registryVersion` for staleness checks (here 5: one entity, three actions, one workflow). Agents consume the inner `snapshot` object.

```json title="Snapshot envelope"
{
  "format": "synqel.snapshot.v1",
  "registryVersion": 5,
  "snapshot": {
    "entities": [
      {
        "id": "checkout_form",
        "type": "form",
        "metadata": { "purpose": "complete_purchase" }
      }
    ],
    "actions": [
      { "id": "fill_shipping", "intent": "mutation", "deterministic": true },
      { "id": "fill_payment", "intent": "mutation", "deterministic": true },
      {
        "id": "submit_checkout",
        "intent": "mutation",
        "deterministic": true,
        "inputJsonSchema": {
          "type": "object",
          "properties": {
            "orderId": { "type": "string" }
          },
          "required": ["orderId"],
          "additionalProperties": false,
          "$schema": "http://json-schema.org/draft-07/schema#"
        }
      }
    ],
    "capabilities": {},
    "workflows": [
      {
        "id": "checkout_flow",
        "steps": ["fill_shipping", "fill_payment", "submit_checkout"]
      }
    ]
  }
}
```

Serve it over HTTP with `synqelSnapshotJsonResponse` or over MCP with `@synqel/mcp`. See [Agents, HTTP, and MCP](./examples.md#agents-http-and-mcp).

## Core concepts

| Concept | What it is |
|---|---|
| Entity | An object that exists in your application: a product, form, user, section. Defined by an id, a type, and optional metadata. |
| Action | Something that can be done: add to cart, navigate, search. Each action has an intent class (navigation, mutation, query, system), a deterministic flag, and an optional `inputJsonSchema` for agent payloads, often derived from Zod at registration. |
| Handler | TypeScript code bound with `bindAction`. It runs when `executeAction` passes policy and optional input validation. |
| Capability | Top-level flags (`canSearch`, `canCheckout`, `canNavigate`), merged incrementally. |
| Workflow | Ordered action IDs forming a named path through your application. |
| Event | Typed runtime events across entity, action, workflow, session, intent, and policy: the observability surface. |
| Policy | Composable rules that gate what each actor (human, agent, voice) may execute. |

## Next steps

- [Protocol Specification](./protocol.md): formal primitives, snapshot envelope, versioning.
- [SDK Reference](./sdk.md): `bindAction`, `executeAction`, HTTP helpers, the MCP adapter.
- [Event Taxonomy](./events.md): event kinds across six categories.
- [Policy System](./policy.md): the default rule and custom rules.
- [Agents, HTTP, and MCP](./examples.md#agents-http-and-mcp): checkout pattern with an MCP bridge.
