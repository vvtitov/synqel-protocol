import { CodeBlock } from "@/components/code-block";

const ENTITY_SCHEMA = `const entitySchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

type SemanticEntity = {
  id: string;
  type: string;
  metadata: Record<string, unknown>;
};`;

const ACTION_SCHEMA = `const actionSchema = z.object({
  id: z.string().min(1),
  intent: z.enum(["navigation", "mutation", "query", "system"]),
  deterministic: z.boolean().default(true),
  description: z.string().optional(),
  inputJsonSchema: z.record(z.string(), z.unknown()).optional(),
});

type SemanticAction = {
  id: string;
  intent: "navigation" | "mutation" | "query" | "system";
  deterministic: boolean;
  description?: string;
  /** JSON Schema for action parameters — portable for agents & MCP. */
  inputJsonSchema?: Record<string, unknown>;
};`;

const CAPABILITY_SCHEMA = `const capabilitySchema = z.object({
  canSearch: z.boolean().optional(),
  canCheckout: z.boolean().optional(),
  canNavigate: z.boolean().optional(),
});

type CapabilityProfile = {
  canSearch?: boolean;
  canCheckout?: boolean;
  canNavigate?: boolean;
};`;

const WORKFLOW_SCHEMA = `const workflowSchema = z.object({
  id: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
});

type WorkflowDefinition = {
  id: string;
  steps: string[];  // references action IDs, minimum 1
};`;

const SNAPSHOT_EXAMPLE = `type RegistrySnapshot = {
  entities: SemanticEntity[];
  actions: SemanticAction[];
  capabilities: CapabilityProfile;
  workflows: WorkflowDefinition[];
};

// Inner payload agents consume (also embedded in the transport envelope below)

type SynqelSnapshotEnvelope = {
  format: "synqel.snapshot.v1";
  registryVersion: number;
  snapshot: RegistrySnapshot;
};`;

const SNAPSHOT_JSON_EXAMPLE = `{
  "format": "synqel.snapshot.v1",
  "registryVersion": 4,
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
            "qty": { "type": "number" }
          }
        }
      },
      { "id": "search_products", "intent": "query", "deterministic": true },
      { "id": "go_checkout", "intent": "navigation", "deterministic": true }
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
}`;

const INTENT_TABLE = [
  {
    intent: "navigation",
    description: "Moves the user to a different view, page, or section within the application.",
    examples: "go_to_settings, open_modal, navigate_back",
    deterministic: "Typically true — the same input always reaches the same destination.",
  },
  {
    intent: "mutation",
    description: "Changes application state — creates, updates, or deletes data. This is the most sensitive intent class.",
    examples: "add_to_cart, submit_form, delete_account",
    deterministic: "Usually true for direct mutations. May be false for mutations that depend on external state.",
  },
  {
    intent: "query",
    description: "Reads data without side effects. Safe for any actor to execute.",
    examples: "search_products, get_user_profile, list_orders",
    deterministic: "True when results depend only on input. False for queries with time-dependent or random results.",
  },
  {
    intent: "system",
    description: "Internal operations that are not directly user-facing: logging, telemetry, configuration.",
    examples: "send_analytics, refresh_token, sync_state",
    deterministic: "Varies by operation.",
  },
];

export default function ProtocolPage() {
  return (
    <article className="max-w-3xl">
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        Protocol Specification
      </h1>
      <p
        className="mt-4 text-lg leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        The Synqel Protocol defines a formal, versioned schema for how web
        applications describe themselves to AI agents.{" "}
        <strong style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
          Synqel is not an MCP replacement
        </strong>
        — it describes meaning and governance; optional packages such as{" "}
        <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>@synqel/mcp</code>{" "}
        expose that surface over Model Context Protocol when you need stdio tools.
      </p>

      {/* Entities */}
      <section id="entities" className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Entities
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          A <strong>SemanticEntity</strong> represents any meaningful object in
          your application — a product, a form, a navigation section, a user
          profile. Entities are identified by a unique <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>id</code>,
          classified by a <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>type</code> string, and
          carry arbitrary <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>metadata</code>.
        </p>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          The <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>type</code> field is intentionally a free-form
          string. The protocol does not prescribe a fixed taxonomy of entity
          types — your application defines what types are meaningful. Common
          examples include <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>product</code>, <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>form</code>, <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>section</code>, <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>user</code>.
        </p>
        <div className="mt-4">
          <CodeBlock code={ENTITY_SCHEMA} language="typescript" title="Entity schema & type" />
        </div>
      </section>

      {/* Actions */}
      <section id="actions" className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Actions
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          A <strong>SemanticAction</strong> represents something that can be
          done within your application. Every action has a unique{" "}
          <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>id</code>, an{" "}
          <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>intent</code> class, a{" "}
          <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>deterministic</code> flag,
          optional human-readable <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>description</code>, and
          optional <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>inputJsonSchema</code>{" "}
          so agents know which parameters to send. When using the reference SDK, you may supply a Zod{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>inputSchema</code> at registration time —
          it populates <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>inputJsonSchema</code> and validates payloads during execution.
        </p>
        <div className="mt-4">
          <CodeBlock code={ACTION_SCHEMA} language="typescript" title="Action schema & type" />
        </div>

        <h3
          className="mt-8 text-xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Intent classes
        </h3>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          The <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>intent</code> field classifies the
          purpose of an action. This is the most important semantic signal for
          AI agents — it tells them whether an action reads data, changes
          state, navigates, or is a system operation.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ color: "var(--color-text-secondary)" }}>
            <thead>
              <tr
                className="border-b text-left"
                style={{ borderColor: "var(--color-border)" }}
              >
                <th className="pb-3 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Intent</th>
                <th className="pb-3 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Description</th>
                <th className="pb-3 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Examples</th>
                <th className="pb-3 font-semibold" style={{ color: "var(--color-text-primary)" }}>Deterministic</th>
              </tr>
            </thead>
            <tbody>
              {INTENT_TABLE.map((row) => (
                <tr
                  key={row.intent}
                  className="border-b"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <td className="py-3 pr-4">
                    <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}>{row.intent}</code>
                  </td>
                  <td className="py-3 pr-4">{row.description}</td>
                  <td className="py-3 pr-4" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8em" }}>{row.examples}</td>
                  <td className="py-3">{row.deterministic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Capabilities
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          A <strong>CapabilityProfile</strong> declares what your application
          can do at a high level. Unlike entities and actions (which are
          specific), capabilities are broad boolean flags that let an AI agent
          quickly assess what&apos;s possible.
        </p>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Capabilities are additive — you can register them incrementally, and
          they merge into a single profile. All fields are optional.
        </p>
        <div className="mt-4">
          <CodeBlock code={CAPABILITY_SCHEMA} language="typescript" title="Capability schema & type" />
        </div>
      </section>

      {/* Workflows */}
      <section id="workflows" className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Workflows
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          A <strong>WorkflowDefinition</strong> describes an ordered sequence
          of steps (referenced by action ID) that together accomplish a named
          goal. Workflows give AI agents a clear path through your application.
        </p>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Every workflow must have at least one step. Steps reference action IDs
          that should be registered in the same registry.
        </p>
        <div className="mt-4">
          <CodeBlock code={WORKFLOW_SCHEMA} language="typescript" title="Workflow schema & type" />
        </div>
      </section>

      {/* Registry Snapshot */}
      <section id="registry-snapshot" className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          The registry snapshot
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          The registry snapshot is the complete semantic surface of your
          application at any point in time. For HTTP, MCP, or logs, wrap it in the{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>synqel.snapshot.v1</code> envelope so consumers also receive a{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>registryVersion</code> counter.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          <CodeBlock code={SNAPSHOT_EXAMPLE} language="typescript" title="Types" />
          <CodeBlock code={SNAPSHOT_JSON_EXAMPLE} language="json" title="Example envelope JSON" />
        </div>
      </section>

      {/* Versioning */}
      <section className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Versioning philosophy
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          The protocol and the SDK are versioned independently. The protocol
          version defines the shape of the semantic contract (entity, action,
          capability, workflow schemas). The SDK version tracks implementation
          features, bug fixes, and API ergonomics.
        </p>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Breaking changes to the protocol require an RFC. Non-breaking
          additions (new optional fields, new event kinds) follow standard
          semver. See{" "}
          <a
            href="https://github.com/vvtitov/synqel-protocol/blob/main/CONTRIBUTING.md"
            className="underline"
            style={{ color: "var(--color-accent)" }}
          >
            CONTRIBUTING.md
          </a>{" "}
          for the full process.
        </p>
      </section>
    </article>
  );
}
