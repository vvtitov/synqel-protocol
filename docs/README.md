# Protocol documentation (`docs/`)

Markdown sources for Synqel Protocol and its reference packages. These files are the single source of documentation: the public site at [synqel-protocol.vercel.app/docs](https://synqel-protocol.vercel.app/docs) renders them at build time.

| File | Site route | Topic |
|------|------------|-------|
| [getting-started.md](./getting-started.md) | `/docs` | Installation, quick start, what an agent sees |
| [protocol.md](./protocol.md) | `/docs/protocol` | Normative protocol shapes and versioning |
| [sdk.md](./sdk.md) | `/docs/sdk` | `@synqel/sdk` and `@synqel/mcp` APIs |
| [events.md](./events.md) | `/docs/events` | Runtime event taxonomy |
| [policy.md](./policy.md) | `/docs/policy` | Policy evaluation rules |
| [examples.md](./examples.md) | `/docs/examples` | Integration patterns |

## Editing

- Edit these files only; the site pages under `apps/web/app/docs/` just render them.
- Link other docs with `./<name>.md`; the site rewrites those links to its routes. Link files outside `docs/` with full GitHub URLs.
- Heading anchors follow GitHub's slugs, so `#anchor` links work the same on GitHub and on the site. Sidebar entries in `apps/web/lib/docs-nav.ts` must point to existing headings; `bun run test` checks this.
