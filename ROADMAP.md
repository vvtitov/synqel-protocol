# Synqel Protocol — roadmap

This file tracks **planned** work for the **open protocol and reference implementation** in this repository. It is informational, not a contractual commitment. For process (RFCs, breaking changes), see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Near term

- Keep `docs/*.md` and `apps/web/app/docs/*` aligned whenever the public API or specification text changes (see [docs/README.md](./docs/README.md)).
- Expand `@synqel/mcp` tests as the MCP SDK surface evolves (error paths, JSON Schema edge cases for tool inputs).
- Optional: single source of truth for long-form docs (e.g. MDX or generated pages from `docs/`) to eliminate manual dual maintenance.

## Medium term

- Protocol **v0.2** milestones: collect feedback from integrations, tighten snapshot envelope evolution rules, and publish migration notes in [CHANGELOG.md](./CHANGELOG.md).
- More examples: real app snippets (Next.js route handlers, MCP host configuration) without bloating the SDK dependency tree.

## Later / out of scope here

- **Layer 4 — Platform** (hosted registry, org features, billing) lives in a separate product repository, not in this open-spec monorepo.
