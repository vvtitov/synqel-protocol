import { CodeBlock } from "@/components/code-block";

const REGISTER_ENTITY_CODE = `import { registerEntity } from "@synqel/sdk";

const entity = registerEntity({
  id: "product_123",
  type: "product",
  metadata: { price: 299, category: "electronics" },
});
// metadata defaults to {} if omitted`;

const REGISTER_ACTION_CODE = `import { registerAction } from "@synqel/sdk";
import { z } from "zod";

// Minimal action
registerAction({
  id: "go_home",
  intent: "navigation",
});

// With Zod input → derives inputJsonSchema + validates on executeAction
registerAction({
  id: "add_to_cart",
  intent: "mutation",
  inputSchema: z.object({
    sku: z.string(),
    qty: z.number().int().positive(),
  }),
});`;

const BIND_ACTION_CODE = `import { bindAction, registerAction } from "@synqel/sdk";

registerAction({ id: "ping", intent: "query" });

bindAction("ping", async (_ctx, input) => {
  return { pong: true, echo: input };
});

// unbindAction("ping") removes the handler`;

const EXECUTE_ACTION_CODE = `import {
  executeAction,
  registerAction,
  bindAction,
  getSemanticRegistry,
} from "@synqel/sdk";

registerAction({ id: "ping", intent: "query" });
bindAction("ping", async () => ({ ok: true }));

const registry = getSemanticRegistry();
const sessionId = registry.startSession();

await executeAction(
  "ping",
  { actor: "human", roles: [] },
  undefined,
  { sessionId },
);

registry.endSession(sessionId);`;

const SNAPSHOT_CODE = `import {
  createSnapshotEnvelope,
  serializeSnapshotEnvelope,
  synqelSnapshotJsonResponse,
  getSemanticRegistry,
} from "@synqel/sdk";

const registry = getSemanticRegistry();

const envelope = createSnapshotEnvelope(registry);
const json = serializeSnapshotEnvelope(registry);

// Next.js Route Handler — e.g. GET /.synqel/snapshot
export function GET() {
  return synqelSnapshotJsonResponse(getSemanticRegistry());
}`;

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

const REGISTRY_CODE = `import { getSemanticRegistry } from "@synqel/sdk";

const registry = getSemanticRegistry();

registry.registerEntity({ id: "e1", type: "product" });
registry.registerAction({ id: "a1", intent: "query" });
registry.bindAction("a1", async () => "done");

await registry.executeAction("a1", { actor: "human", roles: [] });

const sid = registry.startSession();
registry.endSession(sid);

const snapshot = registry.getSnapshot();
const version = registry.getVersion();

registry.updateEntity({ id: "e1", type: "product", metadata: { price: 399 } });
registry.removeEntity("e1");

registry.reset();`;

const EVENT_BUS_CODE = `import { getSemanticRegistry } from "@synqel/sdk";

const registry = getSemanticRegistry();

const unsubscribe = registry.bus.subscribe((event) => {
  console.log(event.type, event);
});

registry.registerEntity({ id: "e1", type: "product" });

unsubscribe();`;

const EVALUATE_POLICY_CODE = `import { evaluatePolicy } from "@synqel/sdk";
import type { PolicyContext, PolicyRule, SemanticAction } from "@synqel/sdk";

const ctx: PolicyContext = {
  actor: "agent",
  roles: ["viewer"],
};

const action: SemanticAction = {
  id: "delete_item",
  intent: "mutation",
  deterministic: true,
};

const decision = evaluatePolicy(ctx, action);

const ownerOnly: PolicyRule = (ctx, action) => {
  if (action.id === "delete_account" && !ctx.roles.includes("owner")) {
    return { allowed: false, reason: "Only owners can delete accounts." };
  }
  return null;
};

evaluatePolicy(ctx, action, [ownerOnly]);`;

const USE_SEMANTIC_RUNTIME_CODE = `import { useSemanticRuntime } from "@synqel/sdk/react";

function MyComponent() {
  const { snapshot, executeAction } = useSemanticRuntime();

  const handleClick = () => {
    void executeAction(
      "submit_form",
      { actor: "human", roles: ["customer"] },
      { formId: "checkout" },
    );
  };

  return (
    <button type="button" onClick={handleClick}>
      Submit ({snapshot.actions.length} actions)
    </button>
  );
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
        Complete API reference for{" "}
        <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>@synqel/sdk</code>.
        Peer dependency:{" "}
        <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>zod</code>.
        The package bundles{" "}
        <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>zod-to-json-schema</code>{" "}
        so optional Zod action inputs become JSON Schema in snapshots. React lives under{" "}
        <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>@synqel/sdk/react</code>.
        For MCP stdio hosts, see{" "}
        <a href="#synqel-mcp" className="underline" style={{ color: "var(--color-accent)" }}>
          @synqel/mcp
        </a>{" "}
        below.
      </p>

      <section id="registerEntity" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>registerEntity</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Validates the input against the entity Zod schema and registers it in the global registry.
          Returns the parsed <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>SemanticEntity</code>.
          Emits <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>entity:registered</code>.
        </p>
        <div className="mt-4">
          <CodeBlock code={REGISTER_ENTITY_CODE} language="typescript" />
        </div>
      </section>

      <section id="registerAction" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>registerAction</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Validates and registers a semantic action. Optional{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>inputSchema</code> (Zod) is accepted at registration:
          it fills <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>inputJsonSchema</code> on the stored action and validates payloads during{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>executeAction</code>.
        </p>
        <div className="mt-4">
          <CodeBlock code={REGISTER_ACTION_CODE} language="typescript" />
        </div>
      </section>

      <section id="bindAction" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>bindAction</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Associates an action id with a handler invoked after policy passes and optional input validation.
          Also available as <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>registry.bindAction</code>.
          Use <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>unbindAction(id)</code> to remove.
        </p>
        <div className="mt-4">
          <CodeBlock code={BIND_ACTION_CODE} language="typescript" />
        </div>
      </section>

      <section id="executeAction" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>executeAction</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Async pipeline: emit <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>action:attempt</code> →{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>evaluatePolicy</code> → optional Zod parse → handler →{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>action:result</code>.
          Top-level <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>executeAction(...)</code> delegates to the global registry.
        </p>
        <div className="mt-4">
          <CodeBlock code={EXECUTE_ACTION_CODE} language="typescript" />
        </div>
      </section>

      <section id="snapshot" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>Snapshot serialization</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Stable envelope <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>synqel.snapshot.v1</code> with{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>registryVersion</code> plus helpers for JSON strings and HTTP responses.
        </p>
        <div className="mt-4">
          <CodeBlock code={SNAPSHOT_CODE} language="typescript" />
        </div>
      </section>

      <section id="registerCapability" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>registerCapability</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Registers application-level capabilities. Capabilities merge incrementally.
          Emits <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>capability:registered</code>.
        </p>
        <div className="mt-4">
          <CodeBlock code={REGISTER_CAPABILITY_CODE} language="typescript" />
        </div>
      </section>

      <section id="registerWorkflow" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>registerWorkflow</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Registers a named workflow. Emits <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>workflow:registered</code>.
        </p>
        <div className="mt-4">
          <CodeBlock code={REGISTER_WORKFLOW_CODE} language="typescript" />
        </div>
      </section>

      <section id="SemanticRegistry" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>SemanticRegistry</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Core registry: CRUD, bind/execute, sessions, snapshot, version. Access singleton via{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>getSemanticRegistry()</code>.
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}> reset()</code> clears handlers and Zod input maps too.
        </p>
        <div className="mt-4">
          <CodeBlock code={REGISTRY_CODE} language="typescript" />
        </div>
      </section>

      <section id="SemanticEventBus" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>SemanticEventBus</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Pub/sub at <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>registry.bus</code>. Subscribe returns unsubscribe.
        </p>
        <div className="mt-4">
          <CodeBlock code={EVENT_BUS_CODE} language="typescript" />
        </div>
      </section>

      <section id="evaluatePolicy" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>evaluatePolicy</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Custom rules first; bundled default last. First denial wins.
        </p>
        <div className="mt-4">
          <CodeBlock code={EVALUATE_POLICY_CODE} language="typescript" />
        </div>
      </section>

      <section id="useSemanticRuntime" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>useSemanticRuntime</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Reactive snapshot via <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>useSyncExternalStore</code>.
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}> executeAction</code> returns a{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>Promise</code> — use{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>void executeAction(...)</code> in sync handlers or{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>async</code> flows as needed.
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Requires <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>&quot;use client&quot;</code>.
        </p>
        <div className="mt-4">
          <CodeBlock code={USE_SEMANTIC_RUNTIME_CODE} language="typescript" />
        </div>
      </section>

      <section id="useSemanticEvents" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>useSemanticEvents</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Subscribes via <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>useEffect</code>; pass a stable callback.
        </p>
        <div className="mt-4">
          <CodeBlock code={USE_SEMANTIC_EVENTS_CODE} language="typescript" />
        </div>
      </section>

      <section id="synqel-mcp" className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
          MCP adapter (<code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>@synqel/mcp</code>)
        </h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Sibling package in this monorepo. Registers MCP tools{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>synqel_get_snapshot</code> and{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>synqel_execute_action</code> so hosts connect via stdio without a custom wire protocol.
          Install with your package manager once published alongside the SDK; source:{" "}
          <a
            href="https://github.com/vvtitov/synqel-protocol/tree/main/packages/mcp"
            className="underline"
            style={{ color: "var(--color-accent)" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            packages/mcp
          </a>.
        </p>
      </section>
    </article>
  );
}
