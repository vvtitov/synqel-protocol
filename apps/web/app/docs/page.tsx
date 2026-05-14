import { CodeBlock } from "@/components/code-block";

const INSTALL_CODE = `bun add @synqel/sdk zod
# optional — MCP stdio bridge for Claude Desktop, Cursor, …
bun add @synqel/mcp`;

const QUICK_START_CODE = `import {
  registerEntity,
  registerAction,
  bindAction,
  registerWorkflow,
} from "@synqel/sdk";
import { z } from "zod";
import { useSemanticRuntime } from "@synqel/sdk/react";

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

function CheckoutPage() {
  const { executeAction } = useSemanticRuntime();

  return (
    <button
      type="button"
      onClick={() =>
        void executeAction(
          "submit_checkout",
          { actor: "human", roles: ["customer"] },
          { orderId: "ord_123" },
        )
      }
    >
      Complete Purchase
    </button>
  );
}`;

const SNAPSHOT_CODE = `{
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
      {
        "id": "submit_checkout",
        "intent": "mutation",
        "deterministic": true,
        "inputJsonSchema": {
          "type": "object",
          "properties": {
            "orderId": { "type": "string" }
          }
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
}`;

export default function DocsPage() {
  return (
    <article className="max-w-3xl">
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        Getting Started
      </h1>
      <p
        className="mt-4 text-lg leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Synqel defines how your application describes itself to AI agents: entities,
        actions (with optional JSON Schema inputs), workflows, policy, and events.
        It complements{" "}
        <a
          href="https://modelcontextprotocol.io/"
          className="underline"
          style={{ color: "var(--color-accent)" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          MCP
        </a>
        — Synqel is the semantic contract;{" "}
        <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>
          @synqel/mcp
        </code>{" "}
        exposes that contract as standard tools when you want stdio MCP hosts.
      </p>

      <section id="installation" className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Installation
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          The SDK requires{" "}
          <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>zod</code>{" "}
          as a peer dependency and bundles{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>zod-to-json-schema</code>{" "}
          so optional Zod inputs become portable JSON Schema in the snapshot.
          React is optional — only if you use{" "}
          <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>@synqel/sdk/react</code>.
        </p>
        <div className="mt-4">
          <CodeBlock code={INSTALL_CODE} language="bash" title="Install" />
        </div>
      </section>

      <section id="quick-start" className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Quick Start
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Register entities and actions, attach Zod input schemas when agents need
          structured parameters, bind handlers for real execution, and expose the
          same snapshot everywhere — UI, HTTP, or MCP.
        </p>
        <div className="mt-4">
          <CodeBlock
            code={QUICK_START_CODE}
            language="typescript"
            title="Quick start example"
          />
        </div>
      </section>

      <section className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          What the AI sees
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          For transport and caching, serialize the registry with the stable{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>synqel.snapshot.v1</code>{" "}
          envelope (includes <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>registryVersion</code>
          {" "}for staleness). Agents consume the inner{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>snapshot</code> object.
        </p>
        <div className="mt-4">
          <CodeBlock
            code={SNAPSHOT_CODE}
            language="json"
            title="Snapshot envelope"
          />
        </div>
      </section>

      <section className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Core concepts
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          {[
            {
              term: "Entity",
              description:
                "An object that exists in your application — a product, form, user, section. Defined by an id, a type, and optional metadata.",
            },
            {
              term: "Action",
              description:
                "Something that can be done — add to cart, navigate, search. Each action has intent class (navigation, mutation, query, system), deterministic flag, and optional inputJsonSchema for agent payloads (often derived from Zod at registration).",
            },
            {
              term: "Handler",
              description:
                "TypeScript code bound with bindAction — runs after policy and optional input validation when executeAction succeeds.",
            },
            {
              term: "Capability",
              description:
                "Top-level flags: canSearch, canCheckout, canNavigate — merged incrementally.",
            },
            {
              term: "Workflow",
              description:
                "Ordered action IDs forming a named path through your application.",
            },
            {
              term: "Event",
              description:
                "Typed runtime events across entity, action, workflow, session, intent, and policy — full observability surface.",
            },
            {
              term: "Policy",
              description:
                "Composable rules that gate what each actor (human, agent, voice) may execute.",
            },
          ].map((concept) => (
            <div
              key={concept.term}
              className="rounded-lg border p-4"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg-secondary)",
              }}
            >
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--color-accent)" }}
              >
                {concept.term}
              </h3>
              <p
                className="mt-1 text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {concept.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Next steps
        </h2>
        <ul className="mt-4 flex flex-col gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <li>
            <a href="/docs/protocol" className="underline" style={{ color: "var(--color-accent)" }}>
              Protocol Specification
            </a>{" "}
            — formal primitives, snapshot envelope, versioning.
          </li>
          <li>
            <a href="/docs/sdk" className="underline" style={{ color: "var(--color-accent)" }}>
              SDK Reference
            </a>{" "}
            — bindAction, executeAction, HTTP helpers, MCP adapter notes.
          </li>
          <li>
            <a href="/docs/events" className="underline" style={{ color: "var(--color-accent)" }}>
              Event Taxonomy
            </a>{" "}
            — event kinds across six categories.
          </li>
          <li>
            <a href="/docs/examples#agents-mcp" className="underline" style={{ color: "var(--color-accent)" }}>
              Agents &amp; MCP
            </a>{" "}
            — checkout pattern with optional MCP bridge.
          </li>
        </ul>
      </section>
    </article>
  );
}
