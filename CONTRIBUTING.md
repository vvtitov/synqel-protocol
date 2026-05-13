# Contributing to Synqel Protocol

Thank you for your interest in contributing to Synqel Protocol! This document covers the process for contributing to both the protocol specification and the SDK implementation.

## Protocol Evolution Process

Synqel Protocol is a versioned open standard. Changes to the protocol follow a structured process to ensure stability for adopters.

### Non-breaking changes

New event kinds, new optional metadata fields, and new capability flags can be added through a standard pull request. These changes must:

- Be backward compatible
- Include updates to the event taxonomy in `src/event-taxonomy.ts`
- Include corresponding Zod schema updates in `src/types.ts`
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

1. Add the event kind string to `EVENT_KINDS` in `src/event-taxonomy.ts`
2. Add the corresponding category to `EVENT_CATEGORIES` if it is new
3. Update the `RuntimeEvent` union in `src/types.ts`
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
git clone https://github.com/synqel/synqel-protocol.git
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

### Rules for SDK contributions

- **Tests required**: every new export must have corresponding unit tests
- **No new runtime dependencies**: the SDK must remain zero-dependency (except `zod`)
- **No `any` types**: every export must be fully typed
- **Strict mode**: TypeScript strict mode is enforced
- **Universal runtime**: code must work in browsers, Node.js, and Bun

### Writing tests

Tests use [Vitest](https://vitest.dev). Place test files in `packages/sdk/__tests__/` following the naming convention `<module>.test.ts`.

```bash
# Run tests once
bun run --cwd packages/sdk test

# Run tests in watch mode
bun run --cwd packages/sdk vitest
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
- [ ] Documentation is updated if the public API changed
- [ ] Commit messages follow the conventional commits format
- [ ] No new runtime dependencies were added to the SDK
- [ ] No `any` types were introduced

## Code of Conduct

Be respectful, constructive, and inclusive. We are building an open standard — thoughtful disagreement is welcome; personal attacks are not.

## Questions?

Open a [Discussion](https://github.com/synqel/synqel-protocol/discussions) for questions about the protocol design or SDK usage.
