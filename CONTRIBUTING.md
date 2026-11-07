# Contributing to Synqel Protocol

Thank you for your interest in contributing to Synqel Protocol! This document covers the process for contributing to both the protocol specification and the SDK implementation.

## Documentation maintenance

**`docs/*.md` is the single source of documentation.** The public site renders those files at build time (`apps/web/app/docs/*` pages call `DocPage`; mapping in `apps/web/lib/docs-content.ts`), so GitHub readers and site visitors see the same text.

- Edit the markdown, never the site pages. Link other docs with relative `./<name>.md` links (the site rewrites them to `/docs/<name>`); link repository files outside `docs/` with full GitHub URLs.
- Give a code block a title with the fence meta, for example ```` ```ts title="semantic.ts" ````.
- Sidebar entries live in `apps/web/lib/docs-nav.ts` and point to GitHub-style heading slugs (`## registerEntity` → `#registerentity`). `bun run test` fails if a sidebar link points to a heading that does not exist, so rename headings and nav entries together.

## Protocol Evolution Process

Synqel Protocol is a versioned open standard. Changes to the protocol follow a structured process to ensure stability for adopters.

### Non-breaking changes

New event kinds, new optional metadata fields, and new capability flags can be added through a standard pull request. These changes must:

- Be backward compatible
- Include updates to the event taxonomy in `packages/sdk/src/event-taxonomy.ts`
- Include corresponding Zod schema updates in `packages/sdk/src/types.ts`
- Include documentation updates in `docs/`
- Include unit tests

### Breaking changes

Breaking changes to the protocol (removing fields, changing type shapes, renaming intent classes) require an RFC:

1. Open an issue titled `RFC: <description>`
2. Describe the motivation, proposed change, and migration path
3. Allow at least 14 days for community discussion
4. A maintainer will approve or request revisions
5. Once approved, submit the implementation PR referencing the RFC

## Adding New Event Kinds

1. Add the event kind string to `EVENT_KINDS` in `packages/sdk/src/event-taxonomy.ts`
2. Add the corresponding category to `EVENT_CATEGORIES` if it is new
3. Update the `RuntimeEvent` union in `packages/sdk/src/types.ts`
4. Add tests in `__tests__/event-taxonomy.test.ts`
5. Document the new event in `docs/events.md`

## Adding New Intent Classes

Intent classes (`navigation`, `mutation`, `query`, `system`) are a core part of the protocol. Adding a new intent class is a **breaking change** and requires the RFC process described above.

## SDK Contribution Guide

### Prerequisites

- [Bun](https://bun.sh) v1.0 or later
- Node.js 18+ (for compatibility testing)

### Setup

```bash
git clone https://github.com/vvtitov/synqel-protocol.git
cd synqel-protocol
bun install
```

### Development workflow

```bash
# Run SDK tests
bun run test

# Type-check everything
bun run typecheck

# Start the docs site locally
bun run dev
```

### Publishing `@synqel/sdk` and `@synqel/mcp`

Both packages are published to **npm** (public).

- **Use `bun publish`, never `npm publish`.** `@synqel/mcp` depends on `@synqel/sdk` through the `workspace:^` protocol. `bun publish` rewrites it to a real semver range (for example `^0.1.1`); `npm publish` ships `workspace:^` verbatim and the package becomes uninstallable.
- **Order:** publish `@synqel/sdk` first, then `@synqel/mcp`, so the SDK version the MCP package depends on already exists.
- **Before publishing:** bump `version` in both `package.json` files and the workspace `version` entries in `bun.lock` (the MCP server reads its reported version from its manifest); move the `Unreleased` notes in `CHANGELOG.md` under the new version.
- **Dry run:** `bun publish --dry-run` from each package directory, and `bun pm pack` to inspect the tarball's `package.json`.
- `prepublishOnly` runs tests and build in each package. `publishConfig.access` is `public`, so scoped packages publish publicly without extra flags.

- **After publishing:** tag the merge commit as `vX.Y.Z` and create a GitHub Release from that tag with the CHANGELOG notes.

**No GitHub Packages mirror.** GitHub's npm registry requires the package scope to match the repository owner. This repository is owned by `vvtitov`, not by a `synqel` user or organization, so `@synqel/*` cannot be published there; the repository's **Packages** sidebar stays empty by design. npm is the only registry.

### Rules for SDK contributions

- **Tests required**: every new export must have corresponding unit tests
- **Keep runtime dependencies minimal**: `@synqel/sdk` ships **`zod`** (peer, `^3.25.28`) plus **`zod-to-json-schema`** for JSON Schema export; do not add transitive-heavy stacks without discussion.
- **`@synqel/mcp`** may depend on `@modelcontextprotocol/sdk` — keep that boundary (transport only).
- **No `any` types**: every export must be fully typed
- **Strict mode**: TypeScript strict mode is enforced
- **Universal runtime**: code must work in browsers, Node.js, and Bun

### Writing tests

Tests use [Vitest](https://vitest.dev).

- **`@synqel/sdk`**: place tests in `packages/sdk/__tests__/` as `<module>.test.ts`. Type-level tests go in `<name>.test-d.ts` and use `expectTypeOf`; Vitest type-checks them, and every other test file, with `tsconfig.test.json` as part of `bun run test`.
- **`@synqel/mcp`**: place tests in `packages/mcp/__tests__/` as `<module>.test.ts` (MCP client/server smoke tests use the SDK’s in-memory transport pair). The MCP package declares **`pretest`** to compile `packages/sdk` first: `@synqel/sdk` is linked from the workspace, but its **`package.exports`** point at `dist/`, so **`dist`** must exist before the tests run.

```bash
# Run repository test suite (SDK, then MCP)
bun run test

# Run workspace tests only
bun run --cwd packages/sdk test
bun run --cwd packages/mcp test

# Watch mode (choose a package)
bun run --cwd packages/sdk vitest
bun run --cwd packages/mcp vitest
```

## Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | A new feature or capability |
| `fix` | A bug fix |
| `docs` | Documentation-only changes |
| `refactor` | Code changes that neither fix a bug nor add a feature |
| `test` | Adding or updating tests |
| `chore` | Build process, tooling, or dependency updates |

### Scopes

| Scope | What it covers |
|-------|----------------|
| `protocol` | Changes to the protocol specification |
| `sdk` | Changes to `@synqel/sdk` |
| `mcp` | Changes to `@synqel/mcp` |
| `web` | Changes to the docs/marketing website |
| `repo` | Repository-level changes (CI, config, etc.) |

### Examples

```
feat(sdk): add workflow step validation
fix(protocol): correct event kind typo in taxonomy
docs(web): add e-commerce integration example
test(sdk): add policy composition edge cases
```

## Pull Request Checklist

Before submitting a PR, confirm that:

- [ ] All existing tests pass (`bun run test`)
- [ ] New code has corresponding tests
- [ ] Type checking passes (`bun run typecheck`)
- [ ] Documentation in **`docs/`** is updated if the public API changed (the site renders it)
- [ ] Commit messages follow the conventional commits format
- [ ] New `@synqel/sdk` runtime dependencies are justified (prefer staying lean: `zod` + `zod-to-json-schema`)
- [ ] No `any` types were introduced

## Code of Conduct

Be respectful, constructive, and inclusive. We are building an open standard — thoughtful disagreement is welcome; personal attacks are not.

## Questions?

Open a [Discussion](https://github.com/vvtitov/synqel-protocol/discussions) for questions about the protocol design or SDK usage.
