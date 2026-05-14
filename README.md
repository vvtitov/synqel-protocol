# Synqel Protocol

> The open standard for AI-navigable web applications.

[![npm version](https://img.shields.io/npm/v/@synqel/sdk)](https://www.npmjs.com/package/@synqel/sdk)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

**Website:** [synqel-protocol.vercel.app](https://synqel-protocol.vercel.app/) · **Documentation (hosted):** [synqel-protocol.vercel.app/docs](https://synqel-protocol.vercel.app/docs)

This repository is where the **protocol**, the **reference SDK**, and the **public documentation site** live together. If you are integrating Synqel into a product, you mostly care about `@synqel/sdk`. If you are helping evolve the standard, everything you need is here — specs in `docs/`, implementation in `packages/sdk/`, and the site in `apps/web/`.

## What is it?

Synqel Protocol is a formal, versioned open standard that defines how a web application describes itself to an AI agent. It is not HTML (visual structure) and not REST (data endpoints). It defines **semantic facts**: what objects exist, what can be done, what the application is capable of, and what policy gates must be satisfied before an action executes.

Think of it as **ARIA for AI agents**. The same way ARIA makes a web page meaningful to a screen reader by attaching roles and states to the DOM, Synqel Protocol makes a web application meaningful to an AI agent by exposing entities, actions, workflows, and events as a structured, machine-readable contract.

The SDK (`@synqel/sdk`) implements the protocol as a lightweight TypeScript library with zero runtime dependencies (except `zod` for schema validation). It works in browsers, Node.js, and Bun. An optional React hook provides framework integration.

## The problem it solves

Today, AI agents that need to navigate a web application see raw HTML — visual structure with no semantic meaning. They resort to scraping, heuristics, and fragile DOM selectors to guess what a button does or what a form expects.

Screen readers faced this exact same problem and the web solved it with ARIA. **Synqel Protocol is to AI agents what ARIA is to screen readers.** It gives your application a clean semantic surface that any agent can read, reason about, and act on — without touching the DOM.

## Install the SDK

We publish `@synqel/sdk` to the npm registry, but **we recommend installing it with Bun or pnpm**. They tend to give faster, more reproducible installs and a simpler story for lockfile review. The JavaScript ecosystem has seen repeated **supply-chain incidents** (typosquatting, leaked tokens, compromised maintainer accounts). No package manager is risk-free; we simply prefer Bun/pnpm day to day and do not document `npm install` as the default path.

```bash
bun add @synqel/sdk
```

```bash
pnpm add @synqel/sdk
```

Peers: you need **`zod`**; for `import "@synqel/sdk/react"` you need **React 18+**.

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
        executeAction("submit_checkout", {
          actor: "human",
          roles: ["customer"],
        })
      }
    >
      Complete Purchase
    </button>
  );
}
```

## The registry snapshot

This is what an AI agent receives — clean, structured, purposeful:

```json
{
  "entities": [
    { "id": "product_123", "type": "product", "metadata": { "price": 299 } }
  ],
  "actions": [
    { "id": "add_to_cart", "intent": "mutation", "deterministic": true }
  ],
  "capabilities": { "canSearch": true, "canCheckout": true },
  "workflows": [
    { "id": "checkout_flow", "steps": ["add_to_cart", "confirm_order"] }
  ]
}
```

No DOM nodes. No CSS selectors. No visual noise. Just meaning.

## Protocol layers

| Layer | What | Where |
|-------|------|-------|
| **Layer 1 — Protocol** | Open standard specification | This repo |
| **Layer 2 — SDK** | `@synqel/sdk` TypeScript library | This repo |
| **Layer 3 — Runtime** | Server-side execution, policy, events | This repo |
| **Layer 4 — Platform** | Synqel SaaS (commercial product) | Separate |

## Documentation

Read the docs online at **[synqel-protocol.vercel.app/docs](https://synqel-protocol.vercel.app/docs)**. The sources in this repo mirror that site:

- [Getting Started](./docs/sdk.md)
- [Protocol Specification](./docs/protocol.md)
- [Event Taxonomy](./docs/events.md)
- [Policy System](./docs/policy.md)
- [Examples](./docs/examples.md)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Protocol evolution process (RFCs for breaking changes)
- Adding new event kinds or intent classes
- SDK contribution guide
- Commit conventions

## License

[MIT](./LICENSE)
