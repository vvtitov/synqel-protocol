# Contributing to Synqel Protocol

Thank you for your interest in contributing to Synqel Protocol! This document covers the process for contributing to both the protocol specification and the SDK implementation.

## Documentation maintenance

The repository has **two** documentation surfaces:

- **`docs/*.md`** — Versioned markdown for readers browsing the repo or GitHub.
- **`apps/web/app/docs/*`** — The public documentation site (Next.js routes; navigation in `apps/web/lib/docs-nav.ts`).

They are **not** auto-synced. Any change that affects how the protocol or SDK is described for end users should usually update **both**, or at least cross-link and note the intentional difference. See **`docs/README.md`**.

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

### Publishing `@synqel/sdk`

The SDK is published to **npm** (public) and **GitHub Packages** (mirror).

- **`@synqel/mcp`** is published with the same scope/process when you cut releases. `prepublishOnly` runs tests and build (`bun run test && bun run build` from `packages/mcp`).

- **npm:** from `packages/sdk`, with npm configured for [registry.npmjs.org](https://registry.npmjs.org), run `npm publish` after bumping `version` (or use your usual release process). `prepublishOnly` runs tests and build.
- **GitHub Packages:** publishing is automated in [`.github/workflows/publish-sdk-github-packages.yml`](./.github/workflows/publish-sdk-github-packages.yml). Creating a **GitHub Release** runs the workflow, or you can start it manually under **Actions**.
- **Scope vs repo owner:** GitHub’s npm registry expects the package scope to match a GitHub **user or organization** name. For `@synqel/sdk`, the account **`synqel`** on GitHub must own the package. If this repository is under another owner (for example a personal account), add a repository secret **`GH_PACKAGES_PUBLISH_TOKEN`**: a classic PAT or fine-grained token with `write:packages` for the **`synqel`** org (or whichever GitHub owner matches `@synqel`). If the secret is absent, the workflow uses `GITHUB_TOKEN`, which only works when the repository owner matches the npm scope.
- After the first successful publish, link or confirm the package under the repository’s **Packages** tab and set visibility to **public** if you want unauthenticated installs from GitHub.

### Rules for SDK contributions

- **Tests required**: every new export must have corresponding unit tests
- **Keep runtime dependencies minimal**: `@synqel/sdk` ships **`zod`** (peer) plus **`zod-to-json-schema`** for JSON Schema export; do not add transitive-heavy stacks without discussion.
- **`@synqel/mcp`** may depend on `@modelcontextprotocol/sdk` — keep that boundary (transport only).
- **No `any` types**: every export must be fully typed
- **Strict mode**: TypeScript strict mode is enforced
- **Universal runtime**: code must work in browsers, Node.js, and Bun

### Writing tests

Tests use [Vitest](https://vitest.dev).

- **`@synqel/sdk`**: place tests in `packages/sdk/__tests__/` as `<module>.test.ts`.
- **`@synqel/mcp`**: place tests in `packages/mcp/__tests__/` as `<module>.test.ts` (MCP client/server smoke tests use the SDK’s in-memory transport pair).

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
- [ ] Documentation is updated if the public API changed (**`docs/`** and overlapping **`apps/web/app/docs/`** pages where applicable)
- [ ] Commit messages follow the conventional commits format
- [ ] New `@synqel/sdk` runtime dependencies are justified (prefer staying lean: `zod` + `zod-to-json-schema`)
- [ ] No `any` types were introduced

## Code of Conduct

Be respectful, constructive, and inclusive. We are building an open standard — thoughtful disagreement is welcome; personal attacks are not.

## Questions?

Open a [Discussion](https://github.com/vvtitov/synqel-protocol/discussions) for questions about the protocol design or SDK usage.
