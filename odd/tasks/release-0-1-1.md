# Release 0.1.1 hardening

Objective: work through the pending items from the 2026-11-06 project status review, up to (not including) publishing 0.1.1.
Branch: `chore/release-0.1.1` · Delivery: ask-on-risk · Test runner: Vitest via `bun run test`.

## Specs

- S1: "continuemos con los pendientes del artifact". Pending items from the status artifact "Próximos pasos sugeridos": "Liberar 0.1.1", "Una sola fuente de docs", "Ampliar tests del MCP", "Ejemplo end-to-end", "Camino a v0.2"; and its risks: "Dos lockfiles", "Publicación sin verificar".
- S2: Expand `@synqel/mcp` tests: "Errores de handler, acciones denegadas por política, esquemas de entrada inválidos."
- S3: Update `@modelcontextprotocol/sdk` (from ^1.12.1) with the S2 suite as a safety net.
- S4: Remove the stray `yarn.lock` (project uses `packageManager: bun@1.2.10`).
- S5: README must not claim npm publication that does not exist (verified 2026-11-06: registry returns 404 for `@synqel/sdk` and `@synqel/mcp`).
- S6: Prepare 0.1.1 (versions, CHANGELOG) up to publish. Publishing requires explicit user consent and credentials. (Assumption: publish is out of scope for this branch.)
- Deferred, needs user decision: single docs source (MDX), end-to-end example, v0.2.

## Tasks

- T1 [S2] inline — MCP error-path and option tests — done (mcp suite 4 → 13 passing)
- T2 [S3] inline — bump MCP SDK, keep suite green — done (1.12.1 → 1.32.2; 85 tests, typecheck, build, stdio smoke OK)
- T3 [S4, S5] inline — remove yarn.lock, fix README badges — pending
- T4 [S6] inline — version bump + CHANGELOG, stop before publish — pending

## Log

- L1 (2026-11-06): "continuemos con los pendientes del artifact"
- L2: Baseline on main@1a8a027: `bun run test` 76 passed (sdk 72, mcp 4); `bun run typecheck` clean. The artifact's "56 tests" figure was a manual undercount.
- L3: Finding: `synqel_execute_action` returns failures (`ok:false`) without MCP `isError: true`. T1 pins current behavior; changing it is a user decision.
