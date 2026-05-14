# @synqel/sdk

Semantic runtime for the **Synqel Protocol** — describe entities, actions, workflows, and policies so agents reason about your **UX**, not raw DOM.

Synqel complements **[Model Context Protocol](https://modelcontextprotocol.io/)**: MCP connects hosts and tools; Synqel defines what your application **means** and **allows**. Use sibling package **`@synqel/mcp`** for stdio MCP servers.

## Install

```bash
bun add @synqel/sdk zod
```

Peers: **`zod`** required; **`react`** optional for `@synqel/sdk/react`.

Runtime deps bundled with the SDK: **`zod-to-json-schema`** (action inputs → portable JSON Schema for snapshots/agents).

## Core usage

```typescript
import {
  registerEntity,
  registerAction,
  bindAction,
  getSemanticRegistry,
  serializeSnapshotEnvelope,
} from "@synqel/sdk";
import { z } from "zod";

registerEntity({
  id: "sku_42",
  type: "product",
  metadata: { price: 99 },
});

registerAction({
  id: "add_to_cart",
  intent: "mutation",
  inputSchema: z.object({ sku: z.string(), qty: z.number() }),
});

bindAction("add_to_cart", async (_ctx, input) => {
  const payload = input as { sku: string; qty: number };
  return { lineId: `${payload.sku}:${payload.qty}` };
});

await getSemanticRegistry().executeAction(
  "add_to_cart",
  { actor: "human", roles: ["customer"] },
  { sku: "sku_42", qty: 1 },
);

console.log(serializeSnapshotEnvelope(getSemanticRegistry()));
```

## HTTP snapshot route

```typescript
import { synqelSnapshotJsonResponse, getSemanticRegistry } from "@synqel/sdk";

export function GET() {
  return synqelSnapshotJsonResponse(getSemanticRegistry());
}
```

## React

```typescript
import { useSemanticRuntime } from "@synqel/sdk/react";

function CartButton() {
  const { executeAction } = useSemanticRuntime();

  return (
    <button
      type="button"
      onClick={() =>
        void executeAction(
          "add_to_cart",
          { actor: "human", roles: ["customer"] },
          { sku: "sku_42", qty: 1 },
        )
      }
    >
      Add
    </button>
  );
}
```

## Docs

Spec + guides live in the main repo under `docs/` and on [synqel-protocol.vercel.app/docs](https://synqel-protocol.vercel.app/docs).

## License

MIT
