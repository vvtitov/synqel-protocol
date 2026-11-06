# Changelog

All notable changes to publishable workspace packages (**`@synqel/sdk`**, **`@synqel/mcp`**) will be documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows SemVer once we leave `0.x`.

## Unreleased

## 0.2.0

### `@synqel/sdk`

- `ExecuteActionResult` gains an optional `code` on failure: `not_found`, `policy_denied`, `invalid_input`, `unbound` or `handler_error`. The new `ExecuteActionErrorCode` type is exported. Additive; successful results are unchanged.

### `@synqel/mcp` (breaking)

- Failed actions now return an MCP tool error (`isError: true`) and include the Synqel `code` in the JSON payload. Previously they were reported as successful tool calls containing `ok: false`.
- When a handler throws, agents receive `"Action handler failed."` instead of the thrown message. Pass `exposeHandlerErrors: true` to restore the previous behavior. The original message is still emitted on the registry event bus.
- Depend on `@synqel/sdk` `^0.2.0`.

### Repository

- Remove the GitHub Packages publish workflow. The `@synqel` scope does not match the repository owner, so the workflow could never succeed, and it ran on every GitHub Release.

## 0.1.1

Published to npm for both packages. First npm release of `@synqel/mcp`; `@synqel/sdk` 0.1.0 had been published and unpublished in May 2026.

### `@synqel/mcp`

- Update `@modelcontextprotocol/sdk` to `^1.32.2`.
- Declare `zod` as a peer dependency. The adapter imports it at runtime but previously listed it only as a dev dependency.
- Depend on `@synqel/sdk` with a caret range (`^0.1.1`) instead of an exact workspace pin.
- Export `SYNQEL_MCP_VERSION`, read from the package manifest; the MCP server reports it as its version instead of a hard-coded string.
- Add a Vitest suite with in-memory MCP client/server transport: tool listing, snapshot envelope, `inputJsonSchema`, `sessionId` passthrough, `defaultPolicyContext`, and error paths (unknown action, policy denial, invalid input, unbound handler, throwing handler, missing tool arguments).

### Both packages

- Require `zod` `^3.25.28` as a peer dependency (was `>=3` in `@synqel/sdk`). `zod-to-json-schema` 3.25.2, used for `inputJsonSchema`, requires that minimum.
- Set `publishConfig.access` to `public` and ship the MIT `LICENSE` file in each tarball.

### Repository

- Document dual documentation surfaces (`docs/` vs `apps/web`) and mitigation in `CONTRIBUTING.md` / `docs/README.md`.
- Remove the stray `yarn.lock`; Bun is the only package manager.

## 0.1.0

- Initial version of `@synqel/sdk` and `@synqel/mcp` aligned with protocol v0.1: semantic registry, snapshots, policy, events, MCP tools (`synqel_get_snapshot`, `synqel_execute_action`). `@synqel/sdk` 0.1.0 was published to npm on 2026-05-13 and unpublished on 2026-05-14; `@synqel/mcp` 0.1.0 was never published.
