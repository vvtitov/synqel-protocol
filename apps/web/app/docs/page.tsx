import { CodeBlock } from "@/components/code-block";

const INSTALL_CODE = `bun add @synqel/sdk
# or
npm install @synqel/sdk`;

const QUICK_START_CODE = `import {
  registerEntity,
  registerAction,
  registerWorkflow,
} from "@synqel/sdk";
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
}`;

const SNAPSHOT_CODE = `{
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
      "deterministic": true
    }
  ],
  "capabilities": {},
  "workflows": [
    {
      "id": "checkout_flow",
      "steps": ["fill_shipping", "fill_payment", "submit_checkout"]
    }
  ]
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
        Synqel Protocol is an open standard that defines how a web application
        describes itself to an AI agent. The SDK provides a lightweight
        TypeScript implementation with Zod validation, a pub/sub event bus, and
        an optional React integration.
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
          The SDK requires <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>zod</code> as
          a peer dependency. React is optional — only needed if you use the{" "}
          <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>@synqel/sdk/react</code> entry
          point.
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
          Register your application&apos;s entities, actions, and workflows.
          These declarations form the semantic surface that AI agents read
          instead of parsing raw HTML.
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
          After registration, the registry produces a structured snapshot. This
          is the contract between your application and any AI agent:
        </p>
        <div className="mt-4">
          <CodeBlock
            code={SNAPSHOT_CODE}
            language="json"
            title="Registry snapshot"
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
                "Something that can be done — add to cart, navigate, search. Each action carries an intent class (navigation, mutation, query, system) and a deterministic flag.",
            },
            {
              term: "Capability",
              description:
                "A top-level declaration of what your application can do: canSearch, canCheckout, canNavigate.",
            },
            {
              term: "Workflow",
              description:
                "An ordered sequence of action steps. Workflows give AI agents a named path through your application.",
            },
            {
              term: "Event",
              description:
                "Everything that happens is captured as a typed runtime event across six categories: entity, action, workflow, session, intent, and policy.",
            },
            {
              term: "Policy",
              description:
                "Deterministic rules that gate what an AI agent is allowed to execute. Composable, explicit, auditable.",
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
            — full formal definition of entities, actions, capabilities, and workflows.
          </li>
          <li>
            <a href="/docs/sdk" className="underline" style={{ color: "var(--color-accent)" }}>
              SDK Reference
            </a>{" "}
            — API documentation for every exported function and class.
          </li>
          <li>
            <a href="/docs/events" className="underline" style={{ color: "var(--color-accent)" }}>
              Event Taxonomy
            </a>{" "}
            — all 20 event kinds across 6 categories.
          </li>
          <li>
            <a href="/docs/examples" className="underline" style={{ color: "var(--color-accent)" }}>
              Examples
            </a>{" "}
            — complete, copy-pasteable integration examples.
          </li>
        </ul>
      </section>
    </article>
  );
}
