---
name: sdk-development
description: >-
  Deep guide for developing and extending @synqel/sdk in packages/sdk/.
  Use when adding new registry features, modifying types/schemas, working with
  the policy system, event taxonomy, React hooks, writing tests, or publishing the package.
---

# SDK Development — `packages/sdk`

## Source layout

```
packages/sdk/src/
├── types.ts          # Zod schemas + inferred TypeScript types
├── registry.ts       # SemanticRegistry, SemanticEventBus, singleton
├── policy.ts         # evaluatePolicy + default rules
├── event-taxonomy.ts # EVENT_KINDS / EVENT_CATEGORIES constants + helpers
├── index.ts          # Public API barrel + convenience register* wrappers
└── react.ts          # React hooks ("use client")
```

## Public API (`index.ts` exports)

### Types
```typescript
SemanticEntity, SemanticAction, CapabilityProfile, WorkflowDefinition
PolicyContext, PolicyDecision, PolicyRule
RuntimeEvent, RegistrySnapshot
EventCategory, EventKind
```

### Zod schemas
```typescript
entitySchema, actionSchema, capabilitySchema, workflowSchema
```

### Registry
```typescript
getSemanticRegistry()              // global singleton
resetSemanticRegistryForTests()    // nulls singleton — tests only
SemanticRegistry, SemanticEventBus
```

### Convenience registrars (delegate to global registry)
```typescript
registerEntity(entity: SemanticEntity)
registerAction(action: SemanticAction)
registerCapability(profile: CapabilityProfile)
registerWorkflow(workflow: WorkflowDefinition)
```

### Policy
```typescript
evaluatePolicy(ctx: PolicyContext, action: SemanticAction, rules?: PolicyRule[])
```

### Taxonomy
```typescript
EVENT_CATEGORIES, EVENT_KINDS
getCategoryFromKind(kind: EventKind): EventCategory
isValidEventKind(kind: string): kind is EventKind
```

## React entry (`@synqel/sdk/react`)

```typescript
useSemanticRuntime()
// returns: { registry, snapshot, executeAction }
// snapshot uses useSyncExternalStore — re-renders on registry mutations
// executeAction(actionId, context): emits action:attempt → evaluatePolicy → emits result

useSemanticEvents(onEvent: (e: RuntimeEvent) => void)
// subscribes to the bus via useEffect
```

## Key design rules

- **Zod validation on all register calls** — schemas live in `types.ts`; throw on invalid input
- **Registry versioning** — a counter is bumped on every mutation; exposed in `RegistrySnapshot`
- **`getEntity` emits `entity:queried`** event on the bus when a hit occurs
- **`reset()`** clears all maps (used by `resetSemanticRegistryForTests`)
- **Event bus is in-process** — `RuntimeEvent` union uses colon notation (`entity:registered`, `action:attempt`); `event-taxonomy.ts` constants use dot notation (`semantic.entity.registered`) — these are parallel systems

### Event system nuance
`RuntimeEvent` union ≠ `EVENT_KINDS` taxonomy 1-to-1:
- `semantic.session.heartbeat` exists in taxonomy but **not** in `RuntimeEvent` union
- `action:registered` exists in `RuntimeEvent` but maps to `semantic.action.registered` in taxonomy

## Adding a new feature — checklist

1. **New type/schema** → `types.ts`: add Zod schema, export inferred type
2. **Registry method** → `registry.ts`: validate with schema, emit appropriate bus event, bump version
3. **Convenience wrapper** → `index.ts`: delegate to `getSemanticRegistry()`
4. **Tests** → `packages/sdk/__tests__/`: cover happy path, validation errors, bus events
5. **Docs** → update `docs/sdk.md` and/or `docs/protocol.md`
6. If **breaking** → RFC required (see `CONTRIBUTING.md`)

## Adding a new event kind

1. Add to `EVENT_KINDS` in `event-taxonomy.ts`
2. Assign it a `EVENT_CATEGORIES` category via `getCategoryFromKind` map
3. Add the matching variant to `RuntimeEvent` union in `types.ts`
4. Update `docs/events.md`

## Policy system

```typescript
// PolicyRule signature
type PolicyRule = (ctx: PolicyContext, action: SemanticAction) => PolicyDecision | null

// evaluatePolicy: runs rules in order, first non-null wins, falls back to allow
evaluatePolicy(ctx, action, rules?)
```

Default bundled rule: blocks `intent: "mutation"` for non-admin agents (actor is not human/voice and roles don't include "admin").

Custom rules passed to `evaluatePolicy` run **before** the default.

## Build

```bash
bun run --cwd packages/sdk build     # tsc → dist/
bun run --cwd packages/sdk test      # vitest run
bun run --cwd packages/sdk typecheck # tsc --noEmit
```

Output: `dist/index.js`, `dist/react.js` + `.d.ts` maps.

## Testing patterns

```typescript
import { resetSemanticRegistryForTests, getSemanticRegistry } from "../src/index.js";

beforeEach(() => resetSemanticRegistryForTests());

// Test registry isolation
const registry = getSemanticRegistry();
registry.registerEntity({ id: "foo", type: "product", metadata: {} });
expect(registry.getSnapshot().entities).toHaveLength(1);
```

Always call `resetSemanticRegistryForTests()` in `beforeEach` to avoid singleton state bleed.

## Publishing

`prepublishOnly` runs `test` then `build`. Package `files` includes only `dist/`.
Peer deps: `zod >=3` (required), `react >=18` (optional, only for `./react`).
