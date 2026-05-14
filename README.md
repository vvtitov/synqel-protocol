# Synqel Protocol

> The open standard for AI-navigable web applications.

[![npm version](https://img.shields.io/npm/v/@synqel/sdk)](https://www.npmjs.com/package/@synqel/sdk)
[![GitHub Packages](https://img.shields.io/badge/GitHub%20Packages-@synqel%2Fsdk-24292f?logo=github)](https://github.com/vvtitov/synqel-protocol/pkgs/npm/sdk)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

**Website:** [synqel-protocol.vercel.app](https://synqel-protocol.vercel.app/) · **Documentation (hosted):** [synqel-protocol.vercel.app/docs](https://synqel-protocol.vercel.app/docs)

This repository is where the **protocol**, the **reference SDK**, and the **public documentation site** live together. If you are integrating Synqel into a product, you mostly care about `@synqel/sdk`. If you are helping evolve the standard, everything you need is here — specs in `docs/`, implementation in `packages/sdk/`, and the site in `apps/web/`.

## What is it?

Synqel Protocol is a formal, versioned open standard that defines how a web application describes itself to an AI agent. It is not HTML (visual structure) and not REST (data endpoints). It defines **semantic facts**: what objects exist, what can be done, what the application is capable of, and what policy gates must be satisfied before an action executes.

Think of it as **ARIA for AI agents**. The same way ARIA makes a web page meaningful to a screen reader by attaching roles and states to the DOM, Synqel Protocol makes a web application meaningful to an AI agent by exposing entities, actions, workflows, and events as a structured, machine-readable contract.

**Synqel is not a replacement for MCP.** [Model Context Protocol](https://modelcontextprotocol.io/) solves *connection and tools* between hosts and agents. Synqel solves *application semantics and governance*: what exists in your product, what actions mean, what parameters they accept (JSON Schema derived from optional Zod schemas), and what each actor may do. Use `@synqel/mcp` when you want those semantics exposed as standard MCP tools (`synqel_get_snapshot`, `synqel_execute_action`).

## The problem it solves

Today, AI agents that need to navigate a web application see raw HTML — visual structure with no semantic meaning. They resort to scraping, heuristics, and fragile DOM selectors to guess what a button does or what a form expects.

Screen readers faced this exact same problem and the web solved it with ARIA. **Synqel Protocol is to AI agents what ARIA is to screen readers.** It gives your application a clean semantic surface that any agent can read, reason about, and act on — without touching the DOM.

## Install the SDK

We publish `@synqel/sdk` to the **public npm registry** and mirror it on **[GitHub Packages](https://github.com/vvtitov/synqel-protocol/pkgs/npm/sdk)** (same name and versions). Prefer **Bun** or **pnpm** for installs; they tend to be faster and make lockfile review easier. The JavaScript ecosystem has seen repeated **supply-chain incidents** (typosquatting, leaked tokens, compromised maintainer accounts). No package manager is risk-free; we simply prefer Bun/pnpm day to day and do not document `npm install` as the default path.

**From the default registry (npm):**

```bash
bun add @synqel/sdk
```

```bash
pnpm add @synqel/sdk
```

**From GitHub Packages** (optional; use the same semver as npm). Point the `@synqel` scope at GitHub’s npm registry, then install as usual:

```ini
# .npmrc (repo or user — exact file name may vary with your tool)
@synqel:registry=https://npm.pkg.github.com
```

```bash
bun add @synqel/sdk
```

```bash
pnpm add @synqel/sdk
```

If the package is **private** in your GitHub org, add a token with at least `read:packages` as `//npm.pkg.github.com/:_authToken=…` in `.npmrc` or via your tool’s secret env. Public packages on GitHub Packages generally install **without** auth.

Peers: you need **`zod`**; for `import "@synqel/sdk/react"` you need **React 18+**.

Optional transport:

- **`@synqel/mcp`** — MCP tools over stdio (depends on `@modelcontextprotocol/sdk`). Keeps Synqel as the semantic layer while MCP remains the wire format.

Runtime footprint of `@synqel/sdk` is **`zod`** plus **`zod-to-json-schema`** so actions can expose portable **JSON Schema** for agents.

## Local development (this monorepo)

```bash
bun install
bun run dev      # docs / marketing site (Next.js, Turbopack)
bun run build
bun run test
bun run typecheck
```

SDK-only:

```bash
bun run --cwd packages/sdk test
bun run --cwd packages/sdk build
```

## Quick example

```typescript
import { registerEntity, registerAction, registerWorkflow } from "@synqel/sdk";
import { z } from "zod";
import { useSemanticRuntime } from "@synqel/sdk/react";

// 1. Register your app's semantic surface
registerEntity({
  id: "checkout_form",
  type: "form",
  metadata: { purpose: "complete_purchase" },
});

registerAction({
  id: "submit_checkout",
  intent: "mutation",
  deterministic: true,
  inputSchema: z.object({
    orderId: z.string(),
  }),
});

bindAction("submit_checkout", async (_ctx, input) => {
  const data = input as { orderId: string };
  return { confirmed: true, orderId: data.orderId };
});

registerWorkflow({
  id: "checkout_flow",
  steps: ["fill_shipping", "fill_payment", "submit_checkout"],
});

// 2. In your React component — read the snapshot the AI sees
function CheckoutPage() {
  const { snapshot, executeAction } = useSemanticRuntime();

  // snapshot.entities, snapshot.actions, snapshot.workflows
  // are exactly what an AI agent reads

  return (
    <button
      onClick={() =>
        void executeAction(
          "submit_checkout",
          {
            actor: "human",
            roles: ["customer"],
          },
          { orderId: "ord_123" },
        )
      }
    >
      Complete Purchase
    </button>
  );
}
```

## Registry snapshot envelope

For HTTP handlers, MCP, or any cross-context sync, serialize the registry with the stable envelope (`synqel.snapshot.v1`):

```typescript
import {
  getSemanticRegistry,
  synqelSnapshotJsonResponse,
} from "@synqel/sdk";

export function GET() {
  return synqelSnapshotJsonResponse(getSemanticRegistry());
}
```

Agents still consume the inner `snapshot` object (`entities`, `actions`, `capabilities`, `workflows`). Actions may include `description` and **`inputJsonSchema`** when you register an optional Zod `inputSchema` or supply JSON Schema manually.

```json
{
  "format": "synqel.snapshot.v1",
  "registryVersion": 4,
  "snapshot": {
    "entities": [
      { "id": "product_123", "type": "product", "metadata": { "price": 299 } }
    ],
    "actions": [
      {
        "id": "add_to_cart",
        "intent": "mutation",
        "deterministic": true,
        "inputJsonSchema": { "type": "object", "properties": { "sku": { "type": "string" } } }
      }
    ],
    "capabilities": { "canSearch": true, "canCheckout": true },
    "workflows": [
      { "id": "checkout_flow", "steps": ["add_to_cart", "confirm_order"] }
    ]
  }
}
```

No DOM nodes. No CSS selectors. No visual noise. Just meaning.

## Protocol layers

| Layer | What | Where |
|-------|------|-------|
| **Layer 1 — Protocol** | Open standard specification | This repo |
| **Layer 2 — SDK** | `@synqel/sdk` TypeScript library | This repo |
| **Transport** | `@synqel/mcp` (MCP tools), HTTP helpers (`synqelSnapshotJsonResponse`) | This repo |
| **Layer 3 — Runtime** | In-process registry, policy, events, action handlers | This repo |
| **Layer 4 — Platform** | Synqel SaaS (commercial product) | Separate |

## Documentation

Read the docs online at **[synqel-protocol.vercel.app/docs](https://synqel-protocol.vercel.app/docs)**. The sources in this repo mirror that site:

- [Getting Started](./docs/sdk.md)
- [Protocol Specification](./docs/protocol.md)
- [Event Taxonomy](./docs/events.md)
- [Policy System](./docs/policy.md)
- [Examples](./docs/examples.md)
- [MCP adapter](./packages/mcp/README.md) (`@synqel/mcp`)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Protocol evolution process (RFCs for breaking changes)
- Adding new event kinds or intent classes
- SDK contribution guide
- Commit conventions

## License

[MIT](./LICENSE)
