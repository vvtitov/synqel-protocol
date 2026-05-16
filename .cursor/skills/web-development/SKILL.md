---
name: web-development
description: >-
  Guide for developing the @synqel/web Next.js 15 documentation and marketing site in apps/web/.
  Use when adding doc pages, editing components, updating styling, working with the navigation,
  adding code examples, or troubleshooting the web app build.
---

# Web Development — `apps/web`

## Stack

- **Next.js 15** (App Router) with **Turbopack** in dev
- **React 19**
- **Tailwind CSS 4** via `@tailwindcss/postcss` — no `tailwind.config.js`
- TypeScript 5.7 strict

## Directory layout

```
apps/web/
├── app/
│   ├── layout.tsx            # Root layout (fonts, nav, global styles)
│   ├── page.tsx              # Landing/home page
│   ├── globals.css           # Tailwind import + CSS variables (theme)
│   ├── icon.tsx              # Favicon
│   ├── opengraph-image.tsx   # OG image
│   └── docs/
│       ├── layout.tsx        # Docs layout (sidebar)
│       ├── page.tsx          # Docs index
│       ├── sdk/page.tsx
│       ├── protocol/page.tsx
│       ├── events/page.tsx
│       ├── policy/page.tsx
│       └── examples/page.tsx
├── components/
│   ├── nav.tsx               # Top navigation
│   ├── sidebar.tsx           # Docs sidebar
│   ├── docs-mobile-nav.tsx   # Mobile navigation for docs
│   ├── install-command.tsx   # Install command UI
│   ├── reveal.tsx            # Reveal animation component
│   └── code-block.tsx        # Syntax-highlighted code display
└── next.config.ts
```

## Theming rules

- **CSS variables only** — defined in `globals.css`
- Dark/light via `prefers-color-scheme` media query
- **Never** use `.dark` or `.light` classes
- **Never** create `tailwind.config.js`

Example pattern for CSS variables:
```css
/* globals.css */
:root {
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0a0a0a;
    --color-foreground: #ededed;
  }
}
```

## Adding a new docs page

1. Create `apps/web/app/docs/<section>/page.tsx`
2. Register routes and sidebar entries in `lib/docs-nav.ts` (`DOC_NAV_SECTIONS`, `DOC_SECTION_PAGES` if needed)
3. Align prose with **`docs/<section>.md`** (repo markdown is not consumed automatically — copy or refactor both sides deliberately)

## SDK code examples in docs

`apps/web` does **not** import `@synqel/sdk` as a dependency. SDK snippets are embedded as **string literals** inside `<CodeBlock>` components:

```tsx
// ✅ Correct pattern — string literal, not a real import
<CodeBlock language="typescript">{`
import { registerEntity } from "@synqel/sdk";

registerEntity({ id: "product_123", type: "product", metadata: {} });
`}</CodeBlock>
```

If you need to actually execute SDK code in the web app, add `"@synqel/sdk": "workspace:*"` to `apps/web/package.json` and run `bun install`. Ensure `packages/sdk` is built first (and `packages/mcp` if you import `@synqel/mcp`).

## Dev commands

```bash
bun run dev              # next dev --turbopack (from repo root)
bun run --cwd apps/web dev   # same, scoped
bun run --cwd apps/web build
bun run --cwd apps/web typecheck
```

## Component conventions

- Mobile-first with Tailwind responsive breakpoints (`sm:`, `md:`, `lg:`)
- `"use client"` only when needed (interactivity, hooks, browser APIs)
- Server Components by default
- Path alias `@/*` maps to `apps/web/*`

## Paths alias

```typescript
// Valid in apps/web
import { Nav } from "@/components/nav";
import { Sidebar } from "@/components/sidebar";
```

## Docs content (`docs/` vs site pages)

`docs/` and `apps/web/app/docs/*` describe the same protocol and SDK today, but the site pages are **hand-authored React** — they are **not** rendered from Markdown automatically.

When docs change:

1. Update `docs/<file>.md` for GitHub/repo readers.
2. Update the matching route under `apps/web/app/docs/<section>/page.tsx` and `lib/docs-nav.ts` when URLs or headings change.

See **`docs/README.md`** for the full split and drift risks.
