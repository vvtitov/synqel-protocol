# Docs single source (docs/*.md rendered by the site)

Objective: make `docs/*.md` the only documentation source and have `apps/web` render it at build time, replacing the hand-written TSX doc pages.
Branch: `docs/single-source` (stacked on `feat/execute-result-union`, PR #4) · Delivery: two PR slices (content, then renderer + pages) · Test runner: Vitest (`bun run test`); web has `typecheck` and `build` only.

## Specs

- S1: User decision (2026-11-06), option chosen verbatim: "docs/*.md → sitio (Recomendado)" — "Los .md del repo pasan a ser la fuente: el sitio los lee al compilar y los renderiza con MDX. GitHub y el sitio muestran lo mismo. Se pierde el JSX hecho a mano de cada página, que pasa a estilos comunes de Markdown."
- S2: Content reconciliation: each `docs/*.md` becomes the superset of its TSX page and current markdown, keeping the most accurate version of every section (e.g. the `synqel.snapshot.v1` envelope, `isError`/`exposeHandlerErrors`, the discriminated `ExecuteActionResult`). `/docs` (Getting Started) gets a new `docs/getting-started.md`. No content the site shows today is lost unless it is wrong.
- S3: Rendering: the site reads `docs/*.md` at build time and renders GFM (tables, blockquotes, fenced code) with the existing `CodeBlock` (copy button, language badge, optional title from the fence meta). Relative `.md` links become `/docs/<name>` routes; links outside `docs/` become GitHub URLs.
- S4: Anchors: heading ids use GitHub-compatible slugs so the same `#anchor` works on GitHub and on the site; `apps/web/lib/docs-nav.ts` hashes are updated to those slugs and a test fails if any nav hash has no matching heading. (Assumption: old camelCase hashes such as `#registerEntity` stop scrolling; pages still load.)
- S5: Docs that describe the dual-surface setup (`README.md`, `CONTRIBUTING.md`, `docs/README.md`) describe the single source instead.

## Tasks

- T1 [S2] delegated (writer, parallel with T2; disjoint surface `docs/`) — reconcile content into docs/*.md — pending
- T2 [S3] delegated (writer, parallel with T1; disjoint surface `apps/web/components`, `apps/web/lib`, deps) — markdown renderer + prose styles — pending
- T3 [S3, S4] inline — replace TSX pages with md-backed pages, update nav hashes, anchor test — pending (depends on T1, T2)
- T4 [S5] inline — update README/CONTRIBUTING/docs/README and CHANGELOG — pending

## Log

- L1 (2026-11-06): "continuemos con los pendientes" + chosen option "docs/*.md → sitio (Recomendado)".
- L2: Explorer map: 6 TSX pages (protocol, sdk, events, policy, examples, getting started) vs 5 md files + docs/README.md; every pair has drifted; no markdown deps; nav scroll-spy needs DOM ids equal to nav hashes; CodeBlock has no syntax highlighting; no web tests.
- L3: Route declaration: T1 and T2 delegated under the Writer trigger (parallel units, disjoint edit surfaces, each several minutes of work) and the long-session context backstop; T3/T4 inline.
