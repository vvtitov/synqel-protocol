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

const STATS = [
  { label: "Open standard", value: "MIT" },
  { label: "Runtime deps", value: "Zod only" },
  { label: "Surfaces", value: "Entities · Actions · Events" },
];

function ProtocolMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <circle cx="20" cy="12" r="3" fill="currentColor" />
      <circle cx="12" cy="26" r="3" fill="currentColor" />
      <circle cx="28" cy="26" r="3" fill="currentColor" />
      <path
        d="M20 15v5M17 22l-4 2M23 22l4 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden pb-24 pt-16 sm:pb-28 sm:pt-20 lg:pb-32 lg:pt-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage: `linear-gradient(var(--hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 70%)",
          }}
          aria-hidden
        />
        <div
          className="hero-blob pointer-events-none absolute -left-32 top-[-10%] h-[min(520px,80vw)] w-[min(520px,80vw)] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, var(--color-accent-glow) 0%, transparent 65%)`,
          }}
          aria-hidden
        />
        <div
          className="hero-blob pointer-events-none absolute -right-24 top-1/4 h-[min(440px,70vw)] w-[min(440px,70vw)] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, var(--color-accent-dim) 40%, transparent) 0%, transparent 70%)`,
          }}
          aria-hidden
        />
        <div
          className="hero-blob pointer-events-none absolute bottom-[-20%] left-1/3 h-[min(380px,60vw)] w-[min(380px,60vw)] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, transparent 72%)`,
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="animate-fade-up mb-8 flex justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "color-mix(in srgb, var(--color-bg-secondary) 88%, transparent)",
                color: "var(--color-text-secondary)",
                boxShadow: "0 0 0 1px var(--card-shine) inset",
              }}
            >
              <ProtocolMark className="size-4 text-[var(--color-accent)]" />
              Open standard · Versioned protocol
            </span>
          </div>

          <h1
            className="animate-fade-up animate-fade-up-delay-1 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-[3.35rem]"
            style={{ color: "var(--color-text-primary)" }}
          >
            The open protocol for{" "}
            <span
              className="relative inline-block"
              style={{ color: "var(--color-accent)" }}
            >
              <span
                className="absolute -inset-x-1 -bottom-1 -z-10 h-[0.55em] rounded-sm opacity-30 sm:h-[0.5em]"
                style={{
                  background: `linear-gradient(90deg, var(--color-accent-dim), var(--color-accent))`,
                }}
                aria-hidden
              />
              AI-navigable
            </span>{" "}
            web applications.
          </h1>

          <p
            className="animate-fade-up animate-fade-up-delay-2 mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Synqel Protocol defines how any web app describes itself to an AI —
            entities, actions, workflows, and events as a semantic contract.{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>
              ARIA for agents
            </strong>
            : meaning first, markup second.
          </p>

          <div className="animate-fade-up animate-fade-up-delay-3 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/docs"
              className="group inline-flex min-h-11 min-w-[200px] items-center justify-center rounded-xl px-7 py-3 text-sm font-semibold shadow-lg transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
                boxShadow: `0 12px 40px -12px var(--color-accent-glow)`,
              }}
            >
              Read the Docs
              <span
                className="ml-1 inline-block transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
            <a
              href="https://github.com/vvtitov/synqel-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 min-w-[200px] items-center justify-center rounded-xl border px-7 py-3 text-sm font-semibold transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-[var(--color-border-hover)] active:translate-y-0"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
                backgroundColor: "color-mix(in srgb, var(--color-bg-secondary) 70%, transparent)",
              }}
            >
              View on GitHub
              <span className="ml-1" aria-hidden>
                ↗
              </span>
            </a>
          </div>

          <ul
            className="mx-auto mt-12 flex max-w-3xl flex-col gap-4 rounded-2xl border px-4 py-5 sm:flex-row sm:items-stretch sm:justify-between sm:gap-0 sm:px-6 sm:py-4"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "color-mix(in srgb, var(--color-bg-secondary) 55%, transparent)",
              boxShadow: "0 0 0 1px var(--card-shine) inset",
            }}
          >
            {STATS.map((item, i) => (
              <li
                key={item.label}
                className={`flex flex-1 flex-col items-center text-center sm:px-2 ${i > 0 ? "border-t pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6" : ""}`}
                style={
                  i > 0
                    ? { borderColor: "var(--color-border)" }
                    : undefined
                }
              >
                <span
                  className="text-lg font-bold tracking-tight sm:text-xl"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {item.value}
                </span>
                <span
                  className="mt-0.5 text-xs font-medium sm:text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-10 max-w-lg">
            <CodeBlock code={INSTALL_CODE} language="bash" title="Install" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="border-t py-20 sm:py-24"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Flow
            </p>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              How it works
            </h2>
            <p
              className="mt-3 text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Three layers from declaration to audited execution — built for
              humans and machines to share the same contract.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-3 sm:gap-5">
            {STEPS.map((step) => (
              <article
                key={step.number}
                className="group relative overflow-hidden rounded-2xl border p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 sm:p-7"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg-secondary)",
                  boxShadow: "0 0 0 1px var(--card-shine) inset",
                }}
              >
                <div
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle, var(--color-accent-glow), transparent 70%)`,
                  }}
                  aria-hidden
                />
                <span
                  className="relative text-sm font-bold tabular-nums"
                  style={{ color: "var(--color-accent)" }}
                >
                  {step.number}
                </span>
                <h3
                  className="relative mt-3 text-xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="relative mt-2 text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After comparison */}
      <section
        className="border-t py-20 sm:py-24"
        style={{
          borderColor: "var(--color-border)",
          background: `linear-gradient(180deg, color-mix(in srgb, var(--color-bg-secondary) 40%, var(--color-bg)) 0%, var(--color-bg) 100%)`,
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Contrast
            </p>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              What AI agents see
            </h2>
            <p
              className="mt-3 text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Without Synqel, agents parse opaque markup. With Synqel, they get
              a registry snapshot — the same surface your runtime exposes.
            </p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div
              className="rounded-2xl border p-1 lg:p-1.5"
              style={{
                borderColor: "var(--color-border)",
                background: `linear-gradient(145deg, color-mix(in srgb, var(--color-danger) 12%, var(--color-bg-secondary)), var(--color-bg-secondary))`,
              }}
            >
              <div
                className="mb-2 flex items-center gap-2 px-3 pt-3 text-xs font-semibold tracking-wide uppercase lg:px-4 lg:pt-4"
                style={{ color: "var(--color-danger)" }}
              >
                <span
                  className="inline-block size-1.5 rounded-full"
                  style={{ backgroundColor: "var(--color-danger)" }}
                  aria-hidden
                />
                Noise
              </div>
              <CodeBlock
                code={BEFORE_CODE}
                language="html"
                title="Before — raw HTML"
              />
            </div>
            <div
              className="rounded-2xl border p-1 ring-1 lg:p-1.5"
              style={{
                borderColor: "var(--color-accent)",
                background: `linear-gradient(145deg, color-mix(in srgb, var(--color-accent) 14%, var(--color-bg-secondary)), var(--color-bg-secondary))`,
                boxShadow: `0 0 0 1px var(--color-accent-glow), 0 24px 80px -40px var(--color-accent-glow)`,
              }}
            >
              <div
                className="mb-2 flex items-center gap-2 px-3 pt-3 text-xs font-semibold tracking-wide uppercase lg:px-4 lg:pt-4"
                style={{ color: "var(--color-accent)" }}
              >
                <span
                  className="inline-block size-1.5 rounded-full"
                  style={{ backgroundColor: "var(--color-accent)" }}
                  aria-hidden
                />
                Signal
              </div>
              <CodeBlock
                code={AFTER_CODE}
                language="json"
                title="After — Synqel snapshot"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key principles */}
      <section
        className="border-t py-20 sm:py-24"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Design
            </p>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Key principles
            </h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <article
                key={principle.title}
                className="rounded-2xl border p-6 transition-[border-color,box-shadow] hover:border-[var(--color-border-hover)] sm:p-7"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg-secondary)",
                  boxShadow: "0 0 0 1px var(--card-shine) inset",
                }}
              >
                <div
                  className="mb-4 h-1 w-10 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, var(--color-accent), var(--color-accent-dim))`,
                  }}
                  aria-hidden
                />
                <h3
                  className="text-lg font-bold"
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
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section
        className="border-t py-20 sm:py-24"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Audience
            </p>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Who it&apos;s for
            </h2>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((audience) => (
              <article
                key={audience.title}
                className="rounded-2xl border p-5 transition-colors hover:border-[var(--color-border-hover)] sm:p-6"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg-secondary)",
                  boxShadow: "0 0 0 1px var(--card-shine) inset",
                }}
              >
                <h3
                  className="text-sm font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {audience.title}
                </h3>
                <p
                  className="mt-2 text-xs leading-relaxed sm:text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {audience.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="border-t py-16 sm:py-20"
        style={{
          borderColor: "var(--color-border)",
          background: `radial-gradient(ellipse 100% 80% at 50% 100%, var(--color-accent-glow), transparent 55%), var(--color-bg-secondary)`,
        }}
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2
            className="text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            Ship a semantic surface your agents can trust.
          </h2>
          <p
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed sm:text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Start with the protocol spec, wire the SDK, and expose a clean
            snapshot — no scraping, no brittle selectors.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/docs/sdk"
              className="inline-flex min-h-11 items-center justify-center rounded-xl px-7 py-3 text-sm font-semibold transition-[transform,opacity] hover:opacity-95 active:scale-[0.99]"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
              }}
            >
              SDK quickstart
            </Link>
            <Link
              href="/docs/protocol"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border px-7 py-3 text-sm font-semibold transition-colors hover:border-[var(--color-border-hover)]"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            >
              Read the specification
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-10"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
          <div className="flex items-center gap-2">
            <ProtocolMark className="size-8 shrink-0 text-[var(--color-accent)]" />
            <p
              className="text-sm leading-snug"
              style={{ color: "var(--color-text-muted)" }}
            >
              Synqel Protocol is open source under the MIT license.
            </p>
          </div>
          <a
            href="https://www.npmjs.com/package/@synqel/sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: "var(--color-accent)" }}
          >
            @synqel/sdk on npm →
          </a>
        </div>
      </footer>
    </main>
  );
}
