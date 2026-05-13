import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

const INSTALL_CODE = `bun add @synqel/sdk
# or
npm install @synqel/sdk`;

const BEFORE_CODE = `<!-- What AI sees today: raw HTML soup -->
<div class="sc-1x2b3c product-card">
  <span class="price-label">$299</span>
  <button class="btn btn-primary sc-4d5e6f"
    onclick="addToCart(123)">
    Add to Cart
  </button>
</div>`;

const AFTER_CODE = `// With Synqel: structured registry snapshot
{
  "entities": [
    {
      "id": "product_123",
      "type": "product",
      "metadata": { "price": 299 }
    }
  ],
  "actions": [
    {
      "id": "add_to_cart",
      "intent": "mutation",
      "deterministic": true
    }
  ],
  "capabilities": {
    "canSearch": true,
    "canCheckout": true
  },
  "workflows": [
    {
      "id": "checkout_flow",
      "steps": ["add_to_cart", "confirm_order"]
    }
  ]
}`;

const STEPS = [
  {
    number: "01",
    title: "Register",
    description:
      "Describe your app's entities and actions in semantic terms. Declare what exists, what can be done, and in what order.",
  },
  {
    number: "02",
    title: "Understand",
    description:
      "AI agents read a clean, structured snapshot — not HTML. They know what objects exist, what actions are available, and what policies apply.",
  },
  {
    number: "03",
    title: "Execute",
    description:
      "Policy-gated actions run safely with a full event audit trail. Every attempt, decision, and result is captured as a semantic event.",
  },
];

const PRINCIPLES = [
  {
    title: "Intent over structure",
    description:
      "Actions carry intent class (navigation, mutation, query, system) — not DOM selectors. AI agents reason about purpose, not markup.",
  },
  {
    title: "Deterministic by default",
    description:
      "Policy gates prevent AI agents from executing mutations without explicit permission. Every action goes through a composable rule chain.",
  },
  {
    title: "Framework-agnostic",
    description:
      "Works with any frontend framework. The React hook is an optional convenience — the core SDK is pure TypeScript with zero framework coupling.",
  },
];

const AUDIENCES = [
  {
    title: "Frontend developers",
    description: "Adding AI features to existing web applications.",
  },
  {
    title: "AI / agent developers",
    description: "Who need structured application context instead of raw HTML.",
  },
  {
    title: "Accessibility engineers",
    description:
      "The same semantic tree concept, richer than ARIA, machine-readable.",
  },
  {
    title: "Platform builders",
    description: "Who need a standardized observability and policy layer.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pb-20 pt-24 text-center sm:px-6">
        <h1
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          The open protocol for{" "}
          <span style={{ color: "var(--color-accent)" }}>
            AI-navigable
          </span>{" "}
          web applications.
        </h1>
        <p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Synqel Protocol defines how any web app describes itself to an AI —
          entities, actions, workflows, and events as a semantic contract.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/docs"
            className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-bg)",
            }}
          >
            Read the Docs &rarr;
          </Link>
          <a
            href="https://github.com/vvtitov/synqel-protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border px-6 py-3 text-sm font-semibold transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            View on GitHub &rarr;
          </a>
        </div>

        <div className="mx-auto mt-10 max-w-md">
          <CodeBlock code={INSTALL_CODE} language="bash" title="Install" />
        </div>
      </section>

      {/* How it works */}
      <section
        className="border-t py-20"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2
            className="text-center text-3xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            How it works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number}>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--color-accent)" }}
                >
                  {step.number}
                </span>
                <h3
                  className="mt-2 text-xl font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After comparison */}
      <section
        className="border-t py-20"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2
            className="text-center text-3xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            What AI agents see
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-center text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Without Synqel, AI agents parse raw HTML with no semantic meaning.
            With Synqel, they receive a structured, purposeful snapshot.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <CodeBlock
              code={BEFORE_CODE}
              language="html"
              title="Before — raw HTML"
            />
            <CodeBlock
              code={AFTER_CODE}
              language="json"
              title="After — Synqel snapshot"
            />
          </div>
        </div>
      </section>

      {/* Key principles */}
      <section
        className="border-t py-20"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2
            className="text-center text-3xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Key principles
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div
                key={principle.title}
                className="rounded-lg border p-6"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg-secondary)",
                }}
              >
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {principle.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section
        className="border-t py-20"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2
            className="text-center text-3xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Who it&apos;s for
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((audience) => (
              <div
                key={audience.title}
                className="rounded-lg border p-5"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg-secondary)",
                }}
              >
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {audience.title}
                </h3>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p
            className="text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Synqel Protocol is open source under the MIT license.
          </p>
        </div>
      </footer>
    </main>
  );
}
