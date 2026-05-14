import { CodeBlock } from "@/components/code-block";

const POLICY_CONTEXT_CODE = `type PolicyContext = {
  actor: "human" | "agent" | "voice";
  roles: string[];
};`;

const POLICY_DECISION_CODE = `type PolicyDecision =
  | { allowed: true }
  | { allowed: false; reason: string };`;

const POLICY_RULE_CODE = `type PolicyRule = (
  ctx: PolicyContext,
  action: SemanticAction,
) => PolicyDecision | null;
// Return null to pass to the next rule
// Return { allowed: false, reason } to deny
// Return { allowed: true } to explicitly allow (but next rules still run)`;

const DEFAULT_RULE_CODE = `const defaultRule: PolicyRule = (ctx, action) => {
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
};`;

const EVALUATE_CODE = `import { evaluatePolicy } from "@synqel/sdk";

// Default behavior — no custom rules
const decision = evaluatePolicy(
  { actor: "agent", roles: ["viewer"] },
  { id: "delete_item", intent: "mutation", deterministic: true },
);
// → { allowed: false, reason: "Agents cannot execute mutation..." }

// Human actors are not restricted by the default rule
const humanDecision = evaluatePolicy(
  { actor: "human", roles: [] },
  { id: "delete_item", intent: "mutation", deterministic: true },
);
// → { allowed: true }`;

const CUSTOM_RULES_CODE = `import { evaluatePolicy } from "@synqel/sdk";
import type { PolicyRule } from "@synqel/sdk";

// Custom rule: only account owners can delete accounts
const ownerOnly: PolicyRule = (ctx, action) => {
  if (action.id === "delete_account" && !ctx.roles.includes("owner")) {
    return { allowed: false, reason: "Only account owners can delete accounts." };
  }
  return null;
};

// Custom rule: block all actions during maintenance
const maintenanceMode: PolicyRule = (_ctx, _action) => {
  if (isMaintenanceWindow()) {
    return { allowed: false, reason: "System is in maintenance mode." };
  }
  return null;
};

// Compose: custom rules run first, then the default rule runs last
const decision = evaluatePolicy(
  { actor: "agent", roles: ["admin"] },
  { id: "delete_account", intent: "mutation", deterministic: true },
  [ownerOnly, maintenanceMode],
);`;

const COMPOSITION_CODE = `// Rule evaluation order:
// 1. Custom rules run in array order
// 2. Default rule runs last
// 3. First non-null "denied" decision wins
// 4. If all rules return null or allowed → action is allowed

evaluatePolicy(ctx, action, [ruleA, ruleB, ruleC]);
// Evaluation: ruleA → ruleB → ruleC → defaultRule
// If ruleB returns { allowed: false, reason: "..." }
//   → stops, returns that denial
// If all return null
//   → defaultRule runs
//   → if defaultRule returns null → { allowed: true }`;

export default function PolicyPage() {
  return (
    <article className="max-w-3xl">
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        Policy System
      </h1>
      <p
        className="mt-4 text-lg leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        The policy system provides deterministic, composable rules that gate
        what each actor may execute.{" "}
        <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>executeAction</code>{" "}
        (UI, HTTP, or MCP via{" "}
        <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>@synqel/mcp</code>) runs{" "}
        <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>evaluatePolicy</code> before handlers;
        decisions emit semantic events for auditing.
      </p>

      <section className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          PolicyContext
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          The context describes who is attempting the action. The{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>actor</code> field distinguishes between
          human users, AI agents, and voice interfaces. The{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>roles</code> array carries
          application-specific permissions.
        </p>
        <div className="mt-4">
          <CodeBlock code={POLICY_CONTEXT_CODE} language="typescript" title="PolicyContext" />
        </div>
      </section>

      <section className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          PolicyDecision
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          A discriminated union — either allowed (no reason needed) or denied
          with a human-readable reason string.
        </p>
        <div className="mt-4">
          <CodeBlock code={POLICY_DECISION_CODE} language="typescript" title="PolicyDecision" />
        </div>
      </section>

      <section className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          PolicyRule
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          A policy rule is a pure function that takes a context and action, and
          returns either a decision or <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>null</code>.
          Returning <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>null</code> means &quot;I have no opinion — pass to the
          next rule.&quot;
        </p>
        <div className="mt-4">
          <CodeBlock code={POLICY_RULE_CODE} language="typescript" title="PolicyRule" />
        </div>
      </section>

      <section className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Default rule
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          The SDK ships with one built-in rule: AI agents cannot execute
          mutation-intent actions unless they hold the{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>&quot;admin&quot;</code> role. This rule always
          runs last in the chain.
        </p>
        <div className="mt-4">
          <CodeBlock code={DEFAULT_RULE_CODE} language="typescript" title="Built-in default rule" />
        </div>
      </section>

      <section className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          evaluatePolicy
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          The main entry point for policy evaluation. Pass a context, an action,
          and optionally an array of custom rules.
        </p>
        <div className="mt-4">
          <CodeBlock code={EVALUATE_CODE} language="typescript" title="Basic usage" />
        </div>
      </section>

      <section className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Custom rules
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Write custom rules to enforce application-specific policies. Rules
          compose naturally — pass them as an array to{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>evaluatePolicy</code>.
        </p>
        <div className="mt-4">
          <CodeBlock code={CUSTOM_RULES_CODE} language="typescript" title="Custom rules" />
        </div>
      </section>

      <section className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Composition model
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Rules are evaluated in order. The first non-null denied decision
          short-circuits the chain. If all rules pass (return{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>null</code>), the action is allowed.
        </p>
        <div className="mt-4">
          <CodeBlock code={COMPOSITION_CODE} language="typescript" title="Composition order" />
        </div>
      </section>
    </article>
  );
}
