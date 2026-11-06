# Policy System

> Deterministic, composable rules that gate what each actor is allowed to execute.

Every `executeAction` call for a registered action evaluates policy before validation and before the handler runs, whether the call comes from your UI, an HTTP route, or MCP through `@synqel/mcp`. Each decision emits semantic events (`policy:evaluated`, and `policy:denied` on denial) for auditing.

## PolicyContext

Describes who is attempting the action.

```typescript title="PolicyContext"
type PolicyContext = {
  actor: "human" | "agent" | "voice";
  roles: string[];
};
```

- `actor` distinguishes between human users, AI agents, and voice interfaces.
- `roles` carries application-specific permission strings (for example `"admin"`, `"owner"`, `"viewer"`).

## PolicyDecision

A discriminated union: either allowed (no reason needed) or denied with a human-readable reason.

```typescript title="PolicyDecision"
type PolicyDecision =
  | { allowed: true }
  | { allowed: false; reason: string };
```

## PolicyRule

A pure function that takes a context and an action and returns a decision or `null`.

```typescript title="PolicyRule"
type PolicyRule = (
  ctx: PolicyContext,
  action: SemanticAction,
) => PolicyDecision | null;
```

| Return value | Effect |
|---|---|
| `null` | No opinion; the next rule runs |
| `{ allowed: false, reason }` | Denies the action and stops the chain |
| `{ allowed: true }` | Treated like `null`; the next rules still run |

## Default rule

The SDK ships with one built-in rule. It always runs last in the chain:

> AI agents cannot execute mutation-intent actions unless they hold the `"admin"` role.

```typescript title="Built-in default rule"
const defaultRule: PolicyRule = (ctx, action) => {
  if (
    ctx.actor === "agent" &&
    action.intent === "mutation" &&
    !ctx.roles.includes("admin")
  ) {
    return {
      allowed: false,
      reason: "Agents cannot execute mutation actions without the admin role.",
    };
  }
  return null;
};
```

Human and voice actors are not restricted by the default rule, and agents may run `navigation`, `query`, and `system` actions with any roles.

## evaluatePolicy

The entry point for policy evaluation. Pass a context, an action, and optionally an array of custom rules.

```typescript title="Basic usage"
import { evaluatePolicy } from "@synqel/sdk";

// Default rule only
const decision = evaluatePolicy(
  { actor: "agent", roles: ["viewer"] },
  { id: "delete_item", intent: "mutation", deterministic: true },
);
// → { allowed: false, reason: "Agents cannot execute mutation actions without the admin role." }

// Human actors are not restricted by the default rule
const humanDecision = evaluatePolicy(
  { actor: "human", roles: [] },
  { id: "delete_item", intent: "mutation", deterministic: true },
);
// → { allowed: true }
```

Calling `evaluatePolicy` directly emits no events. Only `executeAction` emits `policy:evaluated` and `policy:denied`.

## Custom rules

Write custom rules to enforce application-specific policies. Rules compose naturally: pass them as an array to `evaluatePolicy`.

```typescript title="Custom rules"
import { evaluatePolicy } from "@synqel/sdk";
import type { PolicyRule } from "@synqel/sdk";

// Only account owners can delete accounts
const ownerOnly: PolicyRule = (ctx, action) => {
  if (action.id === "delete_account" && !ctx.roles.includes("owner")) {
    return { allowed: false, reason: "Only account owners can delete accounts." };
  }
  return null;
};

// Block every action during a maintenance window
const maintenance = { active: false };

const maintenanceMode: PolicyRule = () => {
  if (maintenance.active) {
    return { allowed: false, reason: "System is in maintenance mode." };
  }
  return null;
};

// Custom rules run first, then the default rule runs last
const decision = evaluatePolicy(
  { actor: "agent", roles: ["admin"] },
  { id: "delete_account", intent: "mutation", deterministic: true },
  [ownerOnly, maintenanceMode],
);
// → { allowed: false, reason: "Only account owners can delete accounts." }
```

### Applying custom rules

`executeAction` (top-level, on `SemanticRegistry`, in `useSemanticRuntime`, and through `@synqel/mcp`) evaluates only the default rule. It takes no custom rules. To enforce your own rules, check them before you call `executeAction`:

```typescript title="Gate executeAction with custom rules"
import { evaluatePolicy, executeAction, getSemanticRegistry } from "@synqel/sdk";
import type { ExecuteActionResult, PolicyContext, PolicyRule } from "@synqel/sdk";

const ownerOnly: PolicyRule = (ctx, action) => {
  if (action.id === "delete_account" && !ctx.roles.includes("owner")) {
    return { allowed: false, reason: "Only account owners can delete accounts." };
  }
  return null;
};

async function executeWithRules(
  actionId: string,
  ctx: PolicyContext,
  input?: unknown,
): Promise<ExecuteActionResult> {
  const action = getSemanticRegistry().getAction(actionId);
  if (action) {
    const decision = evaluatePolicy(ctx, action, [ownerOnly]);
    if (!decision.allowed) {
      return { ok: false, code: "policy_denied", message: decision.reason };
    }
  }
  // executeAction still applies the default rule and reports not_found
  return executeAction(actionId, ctx, input);
}
```

A denial from this wrapper does not emit `policy:denied` on the bus. Emit your own events with `registry.bus.emit(...)` if you need them in your audit log.

## Composition model

Rules are evaluated in order. The first denied decision short-circuits the chain. If no rule denies, the action is allowed.

1. Custom rules run in array order.
2. The default rule runs last.
3. The first `{ allowed: false }` decision wins and is returned.
4. If every rule returns `null` or `{ allowed: true }`, the result is `{ allowed: true }`.

```text title="Composition order"
evaluatePolicy(ctx, action, [ruleA, ruleB, ruleC])

Evaluation: ruleA → ruleB → ruleC → defaultRule
If ruleB returns { allowed: false, reason: "..." }
  → stops, returns that denial
If all return null
  → defaultRule runs
  → if defaultRule returns null → { allowed: true }
```
