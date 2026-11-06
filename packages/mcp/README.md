# @synqel/mcp

Model Context Protocol adapter for [**Synqel**](https://github.com/vvtitov/synqel-protocol): expose your semantic registry to MCP clients as tools instead of inventing a parallel protocol.

## Role

- **MCP** = transport and tooling surface for agents (layer “A”).
- **Synqel** = what your app *means* and what it allows—entities, actions, policies (layers “B” / governance).

This package registers:

| Tool | Purpose |
|------|--------|
| `synqel_get_snapshot` | Full snapshot envelope (`synqel.snapshot.v1`) as JSON |
| `synqel_execute_action` | Policy → optional Zod validation → bound handler |

## Install

```bash
bun add @synqel/mcp @synqel/sdk zod
```

Peer/runtime expectation: Node **18+** (same as `@modelcontextprotocol/sdk`).

## Usage

```typescript
import { getSemanticRegistry, registerAction, bindAction } from "@synqel/sdk";
import { connectSynqelMcpStdio } from "@synqel/mcp";

registerAction({ id: "ping", intent: "query" });
bindAction("ping", async () => ({ ok: true }));

await connectSynqelMcpStdio(getSemanticRegistry(), {
  defaultPolicyContext: { actor: "agent", roles: ["admin"] },
});
```

### Options

| Option | Default | Effect |
|--------|---------|--------|
| `defaultPolicyContext` | `{ actor: "agent", roles: [] }` | Policy context used when `synqel_execute_action` omits `policyContext` |
| `exposeHandlerErrors` | `false` | Return a throwing handler's own message to the agent instead of a generic one |

### Errors

When an action fails, `synqel_execute_action` returns an MCP tool error (`isError: true`) whose text is the Synqel result as JSON, including a `code`:

```json
{ "ok": false, "code": "policy_denied", "message": "Agents cannot execute mutation actions without the admin role." }
```

Codes: `not_found`, `policy_denied`, `invalid_input`, `unbound`, `handler_error`. For `handler_error` the agent sees `"Action handler failed."` unless `exposeHandlerErrors` is `true`, so internal details (hosts, queries, stack messages) stay out of the agent's context. The original message is still emitted on the registry event bus (`action:result`) for your logs.

Missing or malformed tool arguments (for example no `actionId`) are rejected by the MCP SDK's own input validation, also as `isError: true`.

For a ready-made stdio process against the **global** registry singleton:

```bash
bun run --cwd packages/mcp build && node packages/mcp/dist/cli.js
```

Integrations normally call `connectSynqelMcpStdio` from their own entrypoint after wiring the registry.

## License

MIT

## Developing this package

`bun run test` in this package runs **`pretest`** first, which compiles **`@synqel/sdk`** to `packages/sdk/dist` (Vitest resolves the workspace package through its `"exports"` field, which targets `dist/`, not unpublished npm).

```bash
bun run --cwd packages/mcp test
```
