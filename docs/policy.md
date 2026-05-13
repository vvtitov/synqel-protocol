# Policy System

> Deterministic, composable rules that gate what an AI agent is allowed to execute.

## PolicyContext

Describes who is attempting the action.

```typescript
type PolicyContext = {
  actor: "human" | "agent" | "voice";
  roles: string[];
};
```

- `actor` — distinguishes between human users, AI agents, and voice interfaces
- `roles` — application-specific permission strings (e.g., `"admin"`, `"owner"`, `"viewer"`)

## PolicyDecision

A discriminated union: allowed (no reason) or denied (with reason).

```typescript
type PolicyDecision =
  | { allowed: true }
  | { allowed: false; reason: string };
```

## PolicyRule

A pure function that takes context and action, returns a decision or `null`.

```typescript
type PolicyRule = (
  ctx: PolicyContext,
  action: SemanticAction,
) => PolicyDecision | null;
```

- Return `null` → "I have no opinion, pass to the next rule."
- Return `{ allowed: false, reason }` → deny the action.

## Default rule

The SDK ships with one built-in rule that always runs last:

> AI agents cannot execute mutation-intent actions unless they hold the `"admin"` role.

```typescript
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

## evaluatePolicy

```typescript
import { evaluatePolicy } from "@synqel/sdk";

evaluatePolicy(ctx, action);           // uses default rule only
evaluatePolicy(ctx, action, [ruleA]);  // custom rules + default rule
```

### Composition

1. Custom rules run in array order
2. Default rule runs last
3. First non-null denied decision wins
4. If all rules return `null` → action is allowed

## Custom rules

```typescript
import { evaluatePolicy } from "@synqel/sdk";
import type { PolicyRule } from "@synqel/sdk";

const ownerOnly: PolicyRule = (ctx, action) => {
  if (action.id === "delete_account" && !ctx.roles.includes("owner")) {
    return { allowed: false, reason: "Only account owners can delete accounts." };
  }
  return null;
};

evaluatePolicy(ctx, action, [ownerOnly]);
```
