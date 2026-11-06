# Changelog

All notable changes to publishable workspace packages (**`@synqel/sdk`**, **`@synqel/mcp`**) will be documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows SemVer once we leave `0.x`.

## Unreleased

## 0.1.1

First release published to npm for both packages.

### `@synqel/mcp`

- Update `@modelcontextprotocol/sdk` to `^1.32.2`.
- Declare `zod` (`^3.25`) as a peer dependency. The adapter imports it at runtime but previously listed it only as a dev dependency.
- Depend on `@synqel/sdk` with a caret range (`^0.1.1`) instead of an exact workspace pin.
- MCP server reports version `0.1.1`.
- Add a Vitest suite with in-memory MCP client/server transport: tool listing, snapshot envelope, `inputJsonSchema`, `sessionId` passthrough, `defaultPolicyContext`, and error paths (unknown action, policy denial, invalid input, unbound handler, throwing handler, missing tool arguments).

### Both packages

- Set `publishConfig.access` to `public` and ship the MIT `LICENSE` file in each tarball.

### Repository

- Document dual documentation surfaces (`docs/` vs `apps/web`) and mitigation in `CONTRIBUTING.md` / `docs/README.md`.
- Remove the stray `yarn.lock`; Bun is the only package manager.

## 0.1.0

- Initial version of `@synqel/sdk` and `@synqel/mcp` aligned with protocol v0.1: semantic registry, snapshots, policy, events, MCP tools (`synqel_get_snapshot`, `synqel_execute_action`). Tagged in the repository only; never published to a registry.
