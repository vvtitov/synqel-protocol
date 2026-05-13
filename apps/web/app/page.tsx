import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { InstallCommand } from "@/components/install-command";
import { Reveal } from "@/components/reveal";


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

const USE_CASES = [
  {
    title: "Commerce & checkout",
    tag: "Retail · SaaS",
    description:
      "Expose carts, shipping zones, promos, and payment steps as entities and workflows so agents complete purchases without guessing hidden state.",
  },
  {
    title: "Admin & back-office",
    tag: "Internal tools",
    description:
      "Bulk edits, approvals, and role-gated mutations become explicit actions with policy — agents and humans share the same rule chain.",
  },
  {
    title: "Support & ticketing",
    tag: "CX",
    description:
      "Ticket status, allowed transitions, and safe customer-facing actions are readable as a snapshot instead of inferred from DOM layout.",
  },
  {
    title: "Onboarding & wizards",
    tag: "Growth",
    description:
      "Multi-step flows register as ordered workflows: the agent knows what step comes next and which fields are blocking progression.",
  },
  {
    title: "Compliance & regulated flows",
    tag: "Finance · Health",
    description:
      "High-risk steps stay behind policy gates; every attempt and outcome is emitted as a semantic event for auditors and replay.",
  },
  {
    title: "Developer dashboards",
    tag: "DevTools",
    description:
      "Releases, feature flags, pipelines, and environments surface as navigable capabilities — ideal for internal AI assistants and bots.",
  },
];

const BUILDABLE_PRODUCTS = [
  {
    title: "In-app copilot",
    description:
      "A chat or command palette that reads the same registry snapshot your external agents use — one contract, two audiences.",
  },
  {
    title: "Agent bridge (MCP / tools API)",
    description:
      "Map entities and actions to tool definitions so Claude, ChatGPT, or custom agents can plan and execute with your app’s semantics.",
  },
  {
    title: "Agent-native E2E testing",
    description:
      "Drive flows by intent and workflow ids instead of brittle selectors; assert on policy decisions and emitted events.",
  },
  {
    title: "Audit & observability console",
    description:
      "Stream semantic events across tenants or services: who attempted what, which policy fired, and the structured result.",
  },
  {
    title: "Policy playground",
    description:
      "Let operators or developers simulate mutations against rule chains before changes hit production traffic.",
  },
  {
    title: "Multi-tenant AI layer",
    description:
      "Per-workspace or per-customer registry snapshots and capabilities — agents stay scoped to the right org and data boundary.",
  },
];

const STATS = [
  { label: "Open standard", value: "MIT" },
  { label: "Runtime deps", value: "Zod only" },
  { label: "Surfaces", value: "Entities · Actions · Events" },
];

type TagColor = "entity" | "action" | "workflow";

const TAG_STYLE: Record<TagColor, { bg: string; text: string }> = {
  entity:   { bg: "var(--color-tag-entity-bg)",   text: "var(--color-tag-entity)" },
  action:   { bg: "var(--color-tag-action-bg)",    text: "var(--color-tag-action)" },
  workflow: { bg: "var(--color-tag-workflow-bg)",  text: "var(--color-tag-workflow)" },
};

const SNAPSHOT_SECTIONS = [
  {
    label: "entities",
    rows: [
      { id: "product_123", badge: "product",  color: "entity"  as TagColor, delay: 0.25 },
      { id: "cart_456",    badge: "cart",     color: "entity"  as TagColor, delay: 0.35 },
    ],
  },
  {
    label: "actions",
    rows: [
      { id: "add_to_cart",   badge: "mutation",   color: "action" as TagColor, delay: 0.45 },
      { id: "submit_order",  badge: "mutation",   color: "action" as TagColor, delay: 0.53 },
    ],
  },
  {
    label: "workflows",
    rows: [
      { id: "checkout_flow", badge: "3 steps", color: "workflow" as TagColor, delay: 0.62 },
    ],
  },
];

function HeroVisual() {
  return (
    <div
      className="hero-float relative mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:mx-0 lg:max-w-[380px] xl:max-w-[410px]"
      aria-hidden
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -inset-8 -z-10 rounded-3xl opacity-60 blur-3xl"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, var(--color-accent-glow), transparent 68%)`,
        }}
      />
      {/* card */}
      <div
        className="relative overflow-hidden rounded-2xl border font-mono text-xs shadow-2xl"
        style={{
          borderColor: "color-mix(in srgb, var(--color-accent) 55%, var(--color-border))",
          backgroundColor: "var(--color-code-bg)",
          boxShadow: "0 0 0 1px color-mix(in srgb, var(--color-accent) 20%, transparent) inset, 0 32px 80px -20px var(--color-accent-glow)",
        }}
      >
        {/* scan beam */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, var(--color-accent) 40%, var(--color-accent) 60%, transparent 100%)`,
            animation: "scan 4.5s ease-in-out 1.2s infinite",
          }}
        />
        {/* title bar */}
        <div
          className="flex items-center justify-between border-b px-4 py-3"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="live-dot size-2 rounded-full"
              style={{ backgroundColor: "var(--color-success)" }}
            />
            <span style={{ color: "var(--color-text-secondary)" }}>
              registry.snapshot()
            </span>
          </div>
          <span
            className="rounded px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-widest"
            style={{
              backgroundColor: "var(--color-bg-tertiary)",
              color: "var(--color-text-muted)",
            }}
          >
            JSON
          </span>
        </div>
        {/* body */}
        <div className="space-y-3.5 p-4">
          {SNAPSHOT_SECTIONS.map((section) => (
            <div key={section.label}>
              <p
                className="mb-1.5 text-[0.58rem] font-bold uppercase tracking-[0.18em]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {section.label}
              </p>
              <div className="space-y-1">
                {section.rows.map((row) => (
                  <div
                    key={row.id}
                    className="hero-row flex items-center justify-between rounded-lg px-3 py-1.5"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-bg-secondary) 55%, transparent)",
                      animationDelay: `${row.delay}s`,
                    }}
                  >
                    <span style={{ color: "var(--color-text-secondary)" }}>
                      {row.id}
                    </span>
                    <span
                      className="rounded px-2 py-0.5 text-[0.58rem] font-semibold"
                      style={{
                        backgroundColor: TAG_STYLE[row.color].bg,
                        color: TAG_STYLE[row.color].text,
                      }}
                    >
                      {row.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="scroll-mt-[4.5rem] outline-none focus:outline-none sm:scroll-mt-20"
    >
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        {/* dot-grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.32] sm:opacity-[0.45]"
          style={{
            backgroundImage: `radial-gradient(var(--hero-grid) 1.5px, transparent 1.5px)`,
            backgroundSize: "clamp(22px, 4vw, 38px) clamp(22px, 4vw, 38px)",
            maskImage:
              "radial-gradient(ellipse 90% 65% at 50% 0%, black 25%, transparent 75%)",
          }}
          aria-hidden
        />
        {/* blobs */}
        <div
          className="hero-blob pointer-events-none absolute -left-48 -top-28 h-[clamp(320px,60vw,640px)] w-[clamp(320px,60vw,640px)] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, var(--color-accent-glow) 0%, transparent 60%)`,
          }}
          aria-hidden
        />
        <div
          className="hero-blob pointer-events-none absolute -right-36 top-[5%] h-[clamp(260px,48vw,540px)] w-[clamp(260px,48vw,540px)] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, var(--color-accent-dim) 32%, transparent) 0%, transparent 62%)`,
          }}
          aria-hidden
        />
        <div
          className="hero-blob pointer-events-none absolute bottom-[-15%] left-[38%] h-[clamp(200px,36vw,420px)] w-[clamp(200px,36vw,420px)] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, var(--color-accent) 20%, transparent) 0%, transparent 68%)`,
          }}
          aria-hidden
        />

        <div className="page-gutter relative mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">

            {/* ── Left: text ── */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="animate-fade-up mb-6 flex justify-center lg:justify-start">
                <span
                  className="inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-widest"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor:
                      "color-mix(in srgb, var(--color-bg-secondary) 82%, transparent)",
                    color: "var(--color-text-secondary)",
                    boxShadow: "0 0 0 1px var(--card-shine) inset",
                  }}
                >
                  <span
                    className="live-dot size-1.5 rounded-full"
                    style={{ backgroundColor: "var(--color-success)" }}
                  />
                  ARIA for AI agents · Open standard
                </span>
              </div>

              <h1
                className="animate-fade-up animate-fade-up-delay-1 text-balance text-[2.25rem] font-extrabold leading-[1.06] tracking-[-0.025em] sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem]"
                style={{ color: "var(--color-text-primary)" }}
              >
                The open protocol{" "}
                <span className="lg:block">
                  for{" "}
                  <span
                    className="relative inline-block"
                    style={{ color: "var(--color-accent)" }}
                  >
                    <span
                      className="absolute -inset-x-1 -bottom-1 -z-10 h-[0.42em] rounded-sm opacity-25"
                      style={{
                        background: `linear-gradient(90deg, var(--color-accent-dim), var(--color-accent))`,
                      }}
                      aria-hidden
                    />
                    AI-navigable
                  </span>{" "}
                  web apps.
                </span>
              </h1>

              <p
                className="animate-fade-up animate-fade-up-delay-2 mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed sm:text-lg lg:mx-0"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Define what your app{" "}
                <strong style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
                  is
                </strong>
                , what it{" "}
                <strong style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
                  can do
                </strong>
                , and what{" "}
                <strong style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
                  rules apply
                </strong>{" "}
                — as a versioned semantic contract any AI agent can read and
                reason about.
              </p>

              <div className="animate-fade-up animate-fade-up-delay-3 mt-8 flex w-full max-w-[22rem] flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center lg:w-auto">
                <Link
                  href="/docs"
                  className="group inline-flex min-h-12 items-center justify-center rounded-xl px-7 py-3.5 text-sm font-bold transition-[filter,transform] duration-300 md:hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-bg)",
                    boxShadow: `0 14px 40px -12px var(--color-accent-glow)`,
                  }}
                >
                  Read the Docs
                  <span
                    className="ml-1.5 inline-block transition-transform duration-200 md:group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
                <a
                  href="https://github.com/vvtitov/synqel-protocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border px-7 py-3.5 text-sm font-semibold transition-[border-color,transform,filter] duration-300 md:hover:-translate-y-0.5"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                    backgroundColor:
                      "color-mix(in srgb, var(--color-bg-secondary) 65%, transparent)",
                  }}
                >
                  View on GitHub
                  <span className="ml-1.5" aria-hidden>↗</span>
                </a>
              </div>

              <ul
                className="animate-fade-up animate-fade-up-delay-3 mx-auto mt-8 flex w-full flex-col rounded-2xl border sm:flex-row lg:mx-0"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor:
                    "color-mix(in srgb, var(--color-bg-secondary) 50%, transparent)",
                  boxShadow: "0 0 0 1px var(--card-shine) inset",
                }}
              >
                {STATS.map((item, i) => (
                  <li
                    key={item.label}
                    className={`flex flex-1 flex-col items-center justify-center px-6 py-5 text-center ${i > 0 ? "border-t sm:border-t-0 sm:border-l" : ""}`}
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <span
                      className="text-lg font-bold tracking-tight sm:text-xl"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {item.value}
                    </span>
                    <span
                      className="mt-1 text-xs sm:text-sm"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Right: registry preview ── */}
            <div className="animate-fade-up animate-fade-up-delay-1 flex justify-center lg:justify-end">
              <HeroVisual />
            </div>
          </div>

          {/* Install: full width below */}
          <div className="mx-auto mt-10 max-w-lg">
            <InstallCommand />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="border-t py-14 sm:py-20 lg:py-24"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="page-gutter mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Flow
            </p>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
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
          <Reveal className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-3 sm:gap-5">
            {STEPS.map((step) => (
              <article
                key={step.number}
                className="card-lift group relative overflow-hidden rounded-2xl border p-5 sm:p-7"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg-secondary)",
                  boxShadow: "0 0 0 1px var(--card-shine) inset",
                }}
              >
                <div
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 md:group-hover:opacity-100"
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
          </Reveal>
        </div>
      </section>

      {/* Before / After comparison */}
      <section
        className="border-t py-14 sm:py-20 lg:py-24"
        style={{
          borderColor: "var(--color-border)",
          background: `linear-gradient(180deg, color-mix(in srgb, var(--color-bg-secondary) 40%, var(--color-bg)) 0%, var(--color-bg) 100%)`,
        }}
      >
        <div className="page-gutter mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Contrast
            </p>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
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
          <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-2 lg:gap-8">
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

      {/* Use cases */}
      <section
        className="border-t py-14 sm:py-20 lg:py-24"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="page-gutter mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Use cases
            </p>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Where teams adopt Synqel first
            </h2>
            <p
              className="mt-3 text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Any product with multi-step tasks, sensitive mutations, or AI
              copilots benefits from a single semantic contract — not a
              one-off integration per screen.
            </p>
          </div>
          <Reveal className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((item) => (
              <article
                key={item.title}
                className="card-lift flex flex-col rounded-2xl border p-5 sm:p-7"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg-secondary)",
                  boxShadow: "0 0 0 1px var(--card-shine) inset",
                }}
              >
                <span
                  className="text-[0.65rem] font-semibold tracking-wide uppercase"
                  style={{ color: "var(--color-accent)" }}
                >
                  {item.tag}
                </span>
                <h3
                  className="mt-2 text-lg font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-2 flex-1 text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {item.description}
                </p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Products you can build */}
      <section
        className="border-t py-14 sm:py-20 lg:py-24"
        style={{
          borderColor: "var(--color-border)",
          background: `linear-gradient(180deg, var(--color-bg) 0%, color-mix(in srgb, var(--color-bg-secondary) 50%, var(--color-bg)) 100%)`,
        }}
      >
        <div className="page-gutter mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Products
            </p>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              What you can ship on top of the protocol
            </h2>
            <p
              className="mt-3 text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--color-text-secondary)" }}
            >
              The SDK is the spine; these are common product shapes teams build
              once the registry, policy, and events are in place.
            </p>
          </div>
          <Reveal className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
            {BUILDABLE_PRODUCTS.map((product) => (
              <article
                key={product.title}
                className="card-lift rounded-2xl border p-6 sm:p-7"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg-secondary)",
                  boxShadow: "0 0 0 1px var(--card-shine) inset",
                }}
              >
                <h3
                  className="text-base font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {product.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {product.description}
                </p>
              </article>
            ))}
          </Reveal>
          <p
            className="mx-auto mt-10 max-w-2xl text-center text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            See concrete patterns in{" "}
            <Link
              href="/docs/examples"
              className="font-semibold underline-offset-2 hover:underline"
              style={{ color: "var(--color-accent)" }}
            >
              Examples
            </Link>{" "}
            and wire policy in{" "}
            <Link
              href="/docs/policy"
              className="font-semibold underline-offset-2 hover:underline"
              style={{ color: "var(--color-accent)" }}
            >
              Policy
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Key principles */}
      <section
        className="border-t py-14 sm:py-20 lg:py-24"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="page-gutter mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Design
            </p>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Key principles
            </h2>
          </div>
          <Reveal className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <article
                key={principle.title}
                className="rounded-2xl border p-6 sm:p-7"
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
          </Reveal>
        </div>
      </section>

      {/* Who it's for */}
      <section
        className="border-t py-14 sm:py-20 lg:py-24"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="page-gutter mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Audience
            </p>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Who it&apos;s for
            </h2>
          </div>
          <Reveal className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((audience) => (
              <article
                key={audience.title}
                className="rounded-2xl border p-5 sm:p-6"
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
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section
        className="border-t py-12 sm:py-16 lg:py-20"
        style={{
          borderColor: "var(--color-border)",
          background: `radial-gradient(ellipse 100% 80% at 50% 100%, var(--color-accent-glow), transparent 55%), var(--color-bg-secondary)`,
        }}
      >
        <div className="page-gutter mx-auto max-w-3xl text-center">
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
          <div className="mx-auto mt-8 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/docs/sdk"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl px-7 py-3.5 text-sm font-semibold transition-[transform,opacity] active:opacity-90 sm:w-auto sm:min-w-0"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
              }}
            >
              SDK quickstart
            </Link>
            <Link
              href="/docs/protocol"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border px-7 py-3.5 text-sm font-semibold transition-colors active:opacity-90 sm:w-auto sm:min-w-0"
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
        className="border-t py-8 sm:py-10"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="page-gutter mx-auto flex max-w-6xl flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:gap-4 sm:text-left">
          <p
            className="text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>
              SynqelProtocol
            </span>{" "}
            is open source under the MIT license.
          </p>
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
