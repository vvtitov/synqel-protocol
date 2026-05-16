# Changelog

All notable changes to publishable workspace packages (**`@synqel/sdk`**, **`@synqel/mcp`**) will be documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows SemVer once we leave `0.x`.

## Unreleased

- Document dual documentation surfaces (`docs/` vs `apps/web`) and mitigation in `CONTRIBUTING.md` / `docs/README.md`.
- Add `@synqel/mcp` Vitest suite with in-memory MCP client/server transport smoke tests.

## 0.1.0

- Initial publish of `@synqel/sdk` and `@synqel/mcp` aligned with protocol v0.1: semantic registry, snapshots, policy, events, MCP tools (`synqel_get_snapshot`, `synqel_execute_action`).
