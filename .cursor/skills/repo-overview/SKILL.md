---
name: repo-overview
description: >-
  Complete guide to the synqel-protocol monorepo: structure, tooling, scripts, and conventions.
  Use when onboarding to the repo, setting up the dev environment, running builds or tests,
  understanding how packages relate to each other, or when asking what the project is about.
---

# Synqel Protocol — Repo Overview

## What is Synqel Protocol?

An open standard that makes web applications AI-navigable. Analogous to ARIA for screen readers — instead of exposing visual DOM structure, it exposes **semantic facts**: entities, actions, capabilities, and workflows as a structured contract any AI agent can read and act on.

**Transport:** Synqel is not an MCP competitor. Use **`@synqel/mcp`** when you want the registry exposed as MCP tools; the SDK also provides HTTP-friendly snapshot helpers (`synqelSnapshotJsonResponse`).

## Monorepo structure

```
synqel-protocol/
├── packages/
│   ├── sdk/               # @synqel/sdk — publishable NPM package
│   └── mcp/               # @synqel/mcp — MCP adapter (stdio tools)
├── apps/
│   └── web/               # @synqel/web — Next.js 15 docs/marketing site
├── docs/                  # Protocol markdown specs (repo / GitHub; keep in sync with site)
│   ├── protocol.md        # Core spec v0.1
│   ├── sdk.md             # SDK usage guide
│   ├── events.md          # Event taxonomy
│   ├── policy.md          # Policy system
│   └── examples.md        # Real-world patterns
├── tsconfig.base.json     # Shared TS config for library packages
├── package.json           # Root workspace manifest (Bun workspaces)
└── bun.lock
```

## Protocol layers

| Layer | What | Where |
|-------|------|-------|
| 1 — Protocol | Open spec | `docs/` |
| 2 — SDK | `@synqel/sdk` TypeScript library | `packages/sdk/` |
| Transport | `@synqel/mcp` (optional MCP bridge) | `packages/mcp/` |
| 3 — Runtime | Registry, policy, events, action handlers | `packages/sdk/` |
| 4 — Platform | Synqel SaaS | Separate repo |

## Documentation surfaces

- **`docs/*.md`** — Markdown specifications and guides for reviewers and editors in Git.
- **`apps/web`** — Public docs site (`/docs/*` routes). Written as React components, **not** auto-generated from `docs/`.

When protocol or SDK behavior changes, update **both** where they overlap (see `docs/README.md` and `CONTRIBUTING.md`).

## Package manager

Use **Bun** (primary). `bun.lock` is the source of truth.

```bash
bun install            # install all workspaces
bun run dev            # start web app (Turbopack)
bun run build          # build SDK → MCP adapter → web (next build)
bun run test           # run Vitest in SDK then MCP workspace
bun run typecheck      # tsc --noEmit for SDK + MCP + web
```

Run workspace tests directly:
```bash
bun run --cwd packages/sdk test
bun run --cwd packages/sdk build
bun run --cwd packages/mcp test
```

## TypeScript conventions

- **Strict mode** everywhere: `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`
- **ESM only** (`"type": "module"` in SDK)
- Use `.js` extensions in relative imports inside `packages/sdk/src` (required for ESM emit)
- `moduleResolution: bundler` in base config

## Key relationships

- `apps/web` does **not** import `@synqel/sdk` as a workspace dep — SDK code is embedded as string literals in `CodeBlock` components for demo purposes
- To link the real SDK locally, add `@synqel/sdk: "workspace:*"` to `apps/web/package.json` and ensure `packages/sdk` is built first

## Coding conventions

- Architecture: SCREAM + SOLID + DRY + KISS + YAGNI
- CSS: Tailwind 4, no `tailwind.config.js`; CSS variables for theming via `prefers-color-scheme`; no `.dark`/`.light` classes
- Mobile-first responsive design

## Testing

- **Vitest v3**: `packages/sdk/__tests__/`, `packages/mcp/__tests__/`
- No test framework for `apps/web`
- Publishing: `prepublishOnly` on **`@synqel/sdk`** and **`@synqel/mcp`** runs test + build

## Contributing / RFC process

See `CONTRIBUTING.md`. Breaking protocol changes require an RFC. Adding event kinds or intent classes follows the same process.
