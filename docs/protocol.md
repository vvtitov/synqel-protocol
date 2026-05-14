# Protocol Specification

> Synqel Protocol v0.1 — The open standard for AI-navigable web applications.

## Overview

The Synqel Protocol defines a formal, versioned schema for how web applications describe themselves to AI agents. It defines semantic facts — not visual structure (HTML) and not data endpoints (REST).

## Entities

A **SemanticEntity** represents any meaningful object in your application.

```typescript
type SemanticEntity = {
  id: string;       // unique identifier, non-empty
  type: string;     // free-form type classification, non-empty
  metadata: Record<string, unknown>;  // arbitrary key-value pairs, defaults to {}
};
```

The `type` field is intentionally a free-form string. The protocol does not prescribe a fixed taxonomy of entity types — your application defines what types are meaningful.

### Examples

| id | type | metadata |
|---|---|---|
| `product_123` | `product` | `{ price: 299, currency: "USD" }` |
| `checkout_form` | `form` | `{ purpose: "complete_purchase" }` |
| `section_analytics` | `section` | `{ label: "Analytics", path: "/analytics" }` |

## Actions

A **SemanticAction** represents something that can be done within your application.

```typescript
type SemanticAction = {
  id: string;
  intent: "navigation" | "mutation" | "query" | "system";
  deterministic: boolean; // defaults to true
  description?: string;
  /** JSON Schema for parameters this action accepts (for agents, MCP, docs). */
  inputJsonSchema?: Record<string, unknown>;
};
```

When using `@synqel/sdk`, you may pass an optional Zod **`inputSchema`** alongside `registerAction`. The SDK derives **`inputJsonSchema`** automatically and validates payloads during `executeAction`.

### Intent classes

| Intent | Description | Examples |
|---|---|---|
| `navigation` | Moves the user to a different view or section | `go_to_settings`, `open_modal`, `navigate_back` |
| `mutation` | Changes application state — the most sensitive intent class | `add_to_cart`, `submit_form`, `delete_account` |
| `query` | Reads data without side effects | `search_products`, `get_user_profile` |
| `system` | Internal operations not directly user-facing | `send_analytics`, `refresh_token` |

### Deterministic flag

When `deterministic` is `true`, the same input always produces the same result. This helps AI agents predict outcomes and reason about safety.

## Capabilities

A **CapabilityProfile** declares what your application can do at a high level.

```typescript
type CapabilityProfile = {
  canSearch?: boolean;
  canCheckout?: boolean;
  canNavigate?: boolean;
};
```

Capabilities are additive — you can register them incrementally, and they merge.

## Workflows

A **WorkflowDefinition** describes an ordered sequence of action steps.

```typescript
type WorkflowDefinition = {
  id: string;      // unique identifier
  steps: string[]; // ordered array of action IDs, minimum 1
};
```

Workflows give AI agents a named path through your application. Each step references an action ID that should also be registered in the registry.

## The registry snapshot

The registry snapshot is the complete semantic surface of your application at any point in time:

```typescript
type RegistrySnapshot = {
  entities: SemanticEntity[];
  actions: SemanticAction[];
  capabilities: CapabilityProfile;
  workflows: WorkflowDefinition[];
};
```

For transport (HTTP, MCP, logs), prefer the versioned envelope produced by `createSnapshotEnvelope()` / `serializeSnapshotEnvelope()` — see the SDK reference.

```typescript
type SynqelSnapshotEnvelope = {
  format: "synqel.snapshot.v1";
  registryVersion: number;
  snapshot: RegistrySnapshot;
};
```

This envelope keeps **`registryVersion`** (mutation counter) next to the payload so remote agents can detect staleness. The inner snapshot remains free of DOM or visual noise — strictly semantic facts.

## Versioning

The protocol is versioned independently from the SDK. Breaking changes to the protocol require an RFC. See [CONTRIBUTING.md](../CONTRIBUTING.md) for the evolution process.
