import type { PolicyContext, PolicyDecision, PolicyRule, SemanticAction } from "./types.js";

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

export function evaluatePolicy(
  ctx: PolicyContext,
  action: SemanticAction,
  rules: PolicyRule[] = [],
): PolicyDecision {
  const allRules = [...rules, defaultRule];

  for (const rule of allRules) {
    const decision = rule(ctx, action);
    if (decision && !decision.allowed) {
      return decision;
    }
  }

  return { allowed: true };
}
