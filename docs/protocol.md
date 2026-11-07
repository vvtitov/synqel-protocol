# Protocol Specification

> Synqel Protocol v0.1. The open standard for AI-navigable web applications.

## Overview

The Synqel Protocol defines a formal, versioned schema for how web applications describe themselves to AI agents. It defines semantic facts: not visual structure (HTML) and not data endpoints (REST).

Synqel is not an MCP replacement. It describes meaning and governance. Optional packages such as `@synqel/mcp` expose that surface over the [Model Context Protocol](https://modelcontextprotocol.io/) when you need stdio tools. See [MCP adapter (@synqel/mcp)](./sdk.md#mcp-adapter-synqelmcp).

The protocol has four primitives, collected in one snapshot:

| Primitive | Answers | Shape |
|---|---|---|
| [Entity](#entities) | What exists in the app? | `SemanticEntity` |
| [Action](#actions) | What can be done? | `SemanticAction` |
| [Capability](#capabilities) | What is the app able to do at a high level? | `CapabilityProfile` |
| [Workflow](#workflows) | Which ordered path reaches a goal? | `WorkflowDefinition` |

Each shape below is shown as the Zod schema the reference SDK validates with, followed by the TypeScript type it produces.

## Entities

A **SemanticEntity** represents any meaningful object in your application: a product, a form, a navigation section, a user profile. An entity is identified by a unique `id`, classified by a `type` string, and carries arbitrary `metadata`.

```typescript title="Entity schema and type"
const entitySchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

type SemanticEntity = {
  id: string;                        // unique identifier, non-empty
  type: string;                      // free-form classification, non-empty
  metadata: Record<string, unknown>; // arbitrary key-value pairs, defaults to {}
};
```

The `type` field is intentionally a free-form string. The protocol does not prescribe a fixed taxonomy of entity types. Your application defines what types are meaningful. Common examples are `product`, `form`, `section` and `user`.

### Entity examples

| id | type | metadata |
|---|---|---|
| `product_123` | `product` | `{ price: 299, currency: "USD" }` |
| `checkout_form` | `form` | `{ purpose: "complete_purchase" }` |
| `section_analytics` | `section` | `{ label: "Analytics", path: "/analytics" }` |

## Actions

A **SemanticAction** represents something that can be done within your application. Every action has a unique `id`, an `intent` class, a `deterministic` flag, an optional human-readable `description`, and an optional `inputJsonSchema` so agents know which parameters to send.

```typescript title="Action schema and type"
const actionSchema = z.object({
  id: z.string().min(1),
  intent: z.enum(["navigation", "mutation", "query", "system"]),
  deterministic: z.boolean().default(true),
  description: z.string().optional(),
  inputJsonSchema: z.record(z.string(), z.unknown()).optional(),
});

type SemanticAction = {
  id: string;
  intent: "navigation" | "mutation" | "query" | "system";
  deterministic: boolean; // defaults to true
  description?: string;
  /** JSON Schema for the parameters this action accepts (for agents, MCP, docs). */
  inputJsonSchema?: Record<string, unknown>;
};
```

With `@synqel/sdk` you may pass an optional Zod `inputSchema` to `registerAction`. The SDK derives `inputJsonSchema` from it (JSON Schema draft-07) and validates payloads during `executeAction`. See [registerAction](./sdk.md#registeraction).

### Intent classes

The `intent` field classifies the purpose of an action. It is the most important semantic signal for AI agents: it tells them whether an action reads data, changes state, navigates, or is a system operation.

| Intent | Description | Examples | Deterministic |
|---|---|---|---|
| `navigation` | Moves the user to a different view, page, or section within the application. | `go_to_settings`, `open_modal`, `navigate_back` | Typically true: the same input always reaches the same destination. |
| `mutation` | Changes application state: creates, updates, or deletes data. The most sensitive intent class. | `add_to_cart`, `submit_form`, `delete_account` | Usually true for direct mutations. May be false for mutations that depend on external state. |
| `query` | Reads data without side effects. | `search_products`, `get_user_profile`, `list_orders` | True when results depend only on input. False for time-dependent or random results. |
| `system` | Internal operations that are not directly user-facing: logging, telemetry, configuration. | `send_analytics`, `refresh_token`, `sync_state` | Varies by operation. |

The SDK's built-in policy rule keys off this field: agents cannot run `mutation` actions without the `admin` role. See [Policy](./policy.md#default-rule).

### Deterministic flag

When `deterministic` is `true`, the same input always produces the same result. This helps AI agents predict outcomes and reason about safety. It defaults to `true`.

## Capabilities

A **CapabilityProfile** declares what your application can do at a high level. Unlike entities and actions, which are specific, capabilities are broad boolean flags that let an AI agent quickly assess what is possible.

```typescript title="Capability schema and type"
const capabilitySchema = z.object({
  canSearch: z.boolean().optional(),
  canCheckout: z.boolean().optional(),
  canNavigate: z.boolean().optional(),
});

type CapabilityProfile = {
  canSearch?: boolean;
  canCheckout?: boolean;
  canNavigate?: boolean;
};
```

All fields are optional. Capabilities are additive: you can register them incrementally, and each registration merges into a single profile.

## Workflows

A **WorkflowDefinition** describes an ordered sequence of steps, referenced by action ID, that together accomplish a named goal. Workflows give AI agents a clear path through your application.

```typescript title="Workflow schema and type"
const workflowSchema = z.object({
  id: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
});

type WorkflowDefinition = {
  id: string;      // unique identifier
  steps: string[]; // ordered action IDs, minimum 1
};
```

Every workflow must have at least one step. Steps reference action IDs that should be registered in the same registry. The SDK does not check this reference at registration time.

## Registry snapshot

The registry snapshot is the complete semantic surface of your application at any point in time. It contains strictly semantic facts, free of DOM or visual noise.

```typescript title="Snapshot and envelope types"
type RegistrySnapshot = {
  entities: SemanticEntity[];
  actions: SemanticAction[];
  capabilities: CapabilityProfile;
  workflows: WorkflowDefinition[];
};

// Transport envelope for HTTP, MCP, or logs
type SynqelSnapshotEnvelope = {
  format: "synqel.snapshot.v1";
  registryVersion: number;
  snapshot: RegistrySnapshot;
};
```

For transport, wrap the snapshot in the `synqel.snapshot.v1` envelope. The SDK builds it with `createSnapshotEnvelope()` and serializes it with `serializeSnapshotEnvelope()`; the MCP tool `synqel_get_snapshot` returns the same envelope. See [Snapshot serialization](./sdk.md#snapshot-serialization).

`registryVersion` is a mutation counter. It goes up by one on every entity, action, capability, or workflow registration, every entity update, and every successful entity removal. Remote agents compare it to detect a stale snapshot.

```json title="Example envelope"
{
  "format": "synqel.snapshot.v1",
  "registryVersion": 8,
  "snapshot": {
    "entities": [
      { "id": "product_123", "type": "product", "metadata": { "price": 299 } },
      { "id": "cart", "type": "container", "metadata": { "itemCount": 2 } }
    ],
    "actions": [
      {
        "id": "add_to_cart",
        "intent": "mutation",
        "deterministic": true,
        "inputJsonSchema": {
          "type": "object",
          "properties": {
            "sku": { "type": "string" },
            "qty": { "type": "integer", "exclusiveMinimum": 0 }
          },
          "required": ["sku", "qty"],
          "additionalProperties": false,
          "$schema": "http://json-schema.org/draft-07/schema#"
        }
      },
      { "id": "search_products", "intent": "query", "deterministic": true },
      { "id": "go_checkout", "intent": "navigation", "deterministic": true },
      { "id": "confirm_order", "intent": "mutation", "deterministic": true }
    ],
    "capabilities": {
      "canSearch": true,
      "canCheckout": true,
      "canNavigate": true
    },
    "workflows": [
      { "id": "checkout_flow", "steps": ["add_to_cart", "go_checkout", "confirm_order"] }
    ]
  }
}
```

## Versioning

The protocol and the SDK are versioned independently. The protocol version defines the shape of the semantic contract (entity, action, capability, and workflow schemas). The SDK version tracks implementation features, bug fixes, and API ergonomics.

Breaking changes to the protocol require an RFC. Non-breaking additions, such as new optional fields or new event kinds, follow standard semver. See [CONTRIBUTING.md](https://github.com/vvtitov/synqel-protocol/blob/main/CONTRIBUTING.md) for the full process.
