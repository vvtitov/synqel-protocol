import { CodeBlock } from "@/components/code-block";

const REGISTER_ENTITY_CODE = `import { registerEntity } from "@synqel/sdk";

const entity = registerEntity({
  id: "product_123",
  type: "product",
  metadata: { price: 299, category: "electronics" },
});
// metadata defaults to {} if omitted`;

const REGISTER_ACTION_CODE = `import { registerAction } from "@synqel/sdk";

const action = registerAction({
  id: "add_to_cart",
  intent: "mutation",
  deterministic: true,  // defaults to true if omitted
});`;

const REGISTER_CAPABILITY_CODE = `import { registerCapability } from "@synqel/sdk";

registerCapability({ canSearch: true, canCheckout: true });
// capabilities merge — you can call this multiple times
registerCapability({ canNavigate: true });`;

const REGISTER_WORKFLOW_CODE = `import { registerWorkflow } from "@synqel/sdk";

const workflow = registerWorkflow({
  id: "checkout_flow",
  steps: ["add_to_cart", "fill_shipping", "fill_payment", "confirm_order"],
});
// steps must have at least 1 entry, each non-empty string`;

const REGISTRY_CODE = `import { getSemanticRegistry, SemanticRegistry } from "@synqel/sdk";

// Singleton — same instance everywhere in your app
const registry = getSemanticRegistry();

// Register directly on the instance
registry.registerEntity({ id: "e1", type: "product" });
registry.registerAction({ id: "a1", intent: "query" });

// Read back
const entity = registry.getEntity("e1");
const action = registry.getAction("a1");
const workflow = registry.getWorkflow("checkout_flow");

// Full snapshot for AI agent consumption
const snapshot = registry.getSnapshot();

// Version counter increments on every registration
const version = registry.getVersion();

// Update and remove entities
registry.updateEntity({ id: "e1", type: "product", metadata: { price: 399 } });
registry.removeEntity("e1");

// Reset (primarily for tests)
registry.reset();`;

const EVENT_BUS_CODE = `import { getSemanticRegistry } from "@synqel/sdk";

const registry = getSemanticRegistry();

// Subscribe returns an unsubscribe function
const unsubscribe = registry.bus.subscribe((event) => {
  console.log(event.type, event);
});

// Events fire on every registry operation
registry.registerEntity({ id: "e1", type: "product" });
// → logs: "entity:registered" { type: "entity:registered", entity: { id: "e1", ... } }

// Stop listening
unsubscribe();`;

const EVALUATE_POLICY_CODE = `import { evaluatePolicy } from "@synqel/sdk";
import type { PolicyContext, PolicyRule, SemanticAction } from "@synqel/sdk";

const ctx: PolicyContext = {
  actor: "agent",    // "human" | "agent" | "voice"
  roles: ["viewer"],
};

const action: SemanticAction = {
  id: "delete_item",
  intent: "mutation",
  deterministic: true,
};

// Default rule: agents cannot run mutations without "admin" role
const decision = evaluatePolicy(ctx, action);
// → { allowed: false, reason: "Agents cannot execute mutation actions..." }

// Custom rules compose — first denied decision wins
const ownerOnly: PolicyRule = (ctx, action) => {
  if (action.id === "delete_account" && !ctx.roles.includes("owner")) {
    return { allowed: false, reason: "Only owners can delete accounts." };
  }
  return null; // pass to next rule
};

evaluatePolicy(ctx, action, [ownerOnly]);`;

const USE_SEMANTIC_RUNTIME_CODE = `import { useSemanticRuntime } from "@synqel/sdk/react";

function MyComponent() {
  const { registry, snapshot, executeAction } = useSemanticRuntime();

  // snapshot is reactive — re-renders on registry changes
  // snapshot.entities: SemanticEntity[]
  // snapshot.actions: SemanticAction[]
  // snapshot.capabilities: CapabilityProfile
  // snapshot.workflows: WorkflowDefinition[]

  // executeAction runs the policy gate, then emits events
  const handleClick = () => {
    executeAction("submit_form", {
      actor: "human",
      roles: ["customer"],
    });
  };

  return <button onClick={handleClick}>Submit</button>;
}`;

const USE_SEMANTIC_EVENTS_CODE = `import { useSemanticEvents } from "@synqel/sdk/react";
import { useCallback } from "react";

function EventLogger() {
  const handleEvent = useCallback((event) => {
    if (event.type === "policy:denied") {
      console.warn("Policy denied:", event.reason);
    }
    if (event.type === "action:executed") {
      console.log("Action executed:", event.actionId);
    }
  }, []);

  useSemanticEvents(handleEvent);

  return null;
}`;

export default function SdkPage() {
  return (
    <article className="max-w-3xl">
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        SDK Reference
      </h1>
      <p
        className="mt-4 text-lg leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Complete API reference for <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>@synqel/sdk</code>.
        The SDK is universal TypeScript with zero runtime dependencies except{" "}
        <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>zod</code>. React integration is available
        from the <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>@synqel/sdk/react</code> entry point.
      </p>

      <section id="registerEntity" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>registerEntity</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Validates the input against the entity Zod schema and registers it in the global registry.
          Returns the parsed <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>SemanticEntity</code>.
          Emits an <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>entity:registered</code> event.
          Throws a <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>ZodError</code> if validation fails.
        </p>
        <div className="mt-4">
          <CodeBlock code={REGISTER_ENTITY_CODE} language="typescript" />
        </div>
      </section>

      <section id="registerAction" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>registerAction</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Validates and registers a semantic action. The <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>deterministic</code> field
          defaults to <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>true</code>. Emits an{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>action:registered</code> event.
        </p>
        <div className="mt-4">
          <CodeBlock code={REGISTER_ACTION_CODE} language="typescript" />
        </div>
      </section>

      <section id="registerCapability" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>registerCapability</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Registers application-level capabilities. Capabilities merge incrementally — calling this
          multiple times adds to the existing profile. Emits a{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>capability:registered</code> event.
        </p>
        <div className="mt-4">
          <CodeBlock code={REGISTER_CAPABILITY_CODE} language="typescript" />
        </div>
      </section>

      <section id="registerWorkflow" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>registerWorkflow</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Registers a named workflow with an ordered sequence of step IDs.
          Steps must have at least one entry. Emits a{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>workflow:registered</code> event.
        </p>
        <div className="mt-4">
          <CodeBlock code={REGISTER_WORKFLOW_CODE} language="typescript" />
        </div>
      </section>

      <section id="SemanticRegistry" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>SemanticRegistry</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          The core class that holds all registered entities, actions, capabilities, and workflows.
          Access the global singleton via <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>getSemanticRegistry()</code>.
          The registry tracks a version counter that increments on every mutation.
        </p>
        <div className="mt-4">
          <CodeBlock code={REGISTRY_CODE} language="typescript" />
        </div>
      </section>

      <section id="SemanticEventBus" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>SemanticEventBus</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          A lightweight pub/sub event bus attached to every registry instance
          at <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>registry.bus</code>. Every registry operation emits a typed{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>RuntimeEvent</code>.
          Subscribe returns an unsubscribe function.
        </p>
        <div className="mt-4">
          <CodeBlock code={EVENT_BUS_CODE} language="typescript" />
        </div>
      </section>

      <section id="evaluatePolicy" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>evaluatePolicy</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Evaluates a chain of policy rules against a context and action.
          Custom rules run first; the built-in default rule runs last.
          The first non-null denied decision wins. If all rules pass, the action is allowed.
        </p>
        <div className="mt-4">
          <CodeBlock code={EVALUATE_POLICY_CODE} language="typescript" />
        </div>
      </section>

      <section id="useSemanticRuntime" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>useSemanticRuntime</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          React hook that provides reactive access to the registry snapshot.
          Uses <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>useSyncExternalStore</code> for
          tear-free reads. Returns the registry instance, current snapshot, and
          an <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>executeAction</code> function that runs
          the policy gate before executing.
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Import from <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>@synqel/sdk/react</code> — this
          export requires the <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>&quot;use client&quot;</code> directive.
        </p>
        <div className="mt-4">
          <CodeBlock code={USE_SEMANTIC_RUNTIME_CODE} language="typescript" />
        </div>
      </section>

      <section id="useSemanticEvents" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>useSemanticEvents</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          React hook that subscribes to all registry events via{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>useEffect</code>.
          Pass a stable callback (wrapped in <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>useCallback</code>)
          to avoid unnecessary resubscriptions.
        </p>
        <div className="mt-4">
          <CodeBlock code={USE_SEMANTIC_EVENTS_CODE} language="typescript" />
        </div>
      </section>
    </article>
  );
}
