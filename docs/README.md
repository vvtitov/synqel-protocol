# Protocol documentation (`docs/`)

Markdown sources for Synqel Protocol **v0.1** and related guides:

| File | Topic |
|------|--------|
| [protocol.md](./protocol.md) | Normative protocol shapes and versioning |
| [sdk.md](./sdk.md) | `@synqel/sdk` APIs and integration |
| [events.md](./events.md) | Runtime event taxonomy |
| [policy.md](./policy.md) | Policy evaluation rules |
| [examples.md](./examples.md) | Integration patterns |

## Relationship to `apps/web`

The public site builds from **React pages** under `apps/web/app/docs/` (navigation in `apps/web/lib/docs-nav.ts`). Those pages are **not** generated from this folder today.

That means two documentation surfaces exist:

- **Readers on GitHub** — start here (`docs/`).
- **Readers on synqel-protocol.vercel.app** — curated pages in `apps/web`.

Both should stay aligned whenever you change specification wording, taxonomy, APIs, or examples that appear in either place.
