export default function EventsPage() {
  const categories = [
    {
      category: "semantic.entity",
      description: "Lifecycle events for entities registered in the semantic registry.",
      events: [
        {
          kind: "semantic.entity.registered",
          fires: "When registerEntity() is called",
          payload: "{ type: \"entity:registered\"; entity: SemanticEntity }",
        },
        {
          kind: "semantic.entity.queried",
          fires: "When getEntity() finds an entity",
          payload: "{ type: \"entity:queried\"; entityId: string }",
        },
        {
          kind: "semantic.entity.updated",
          fires: "When updateEntity() is called",
          payload: "{ type: \"entity:updated\"; entity: SemanticEntity }",
        },
        {
          kind: "semantic.entity.removed",
          fires: "When removeEntity() succeeds",
          payload: "{ type: \"entity:removed\"; entityId: string }",
        },
      ],
    },
    {
      category: "semantic.action",
      description: "Events for action registration, policy-gated execution, and results.",
      events: [
        {
          kind: "semantic.action.attempt",
          fires: "When executeAction begins (before policy evaluation)",
          payload: "{ type: \"action:attempt\"; actionId: string; context: PolicyContext; sessionId?: string }",
        },
        {
          kind: "semantic.action.result",
          fires: "When an execution attempt completes (policy denial, validation error, handler result, or thrown error)",
          payload: "{ type: \"action:result\"; actionId: string; ok: boolean; message?: string; data?: unknown }",
        },
        {
          kind: "semantic.action.executed",
          fires: "After policy passes, validation succeeds, and the bound handler completes without throwing",
          payload: "{ type: \"action:executed\"; actionId: string }",
        },
      ],
    },
    {
      category: "semantic.workflow",
      description: "Events for workflow lifecycle — start, step progression, completion, and failure.",
      events: [
        {
          kind: "semantic.workflow.started",
          fires: "When a workflow execution begins",
          payload: "{ type: \"workflow:started\"; workflowId: string }",
        },
        {
          kind: "semantic.workflow.step",
          fires: "When a workflow advances to the next step",
          payload: "{ type: \"workflow:step\"; workflowId: string; stepIndex: number; stepId: string }",
        },
        {
          kind: "semantic.workflow.completed",
          fires: "When all steps in a workflow complete successfully",
          payload: "{ type: \"workflow:completed\"; workflowId: string }",
        },
        {
          kind: "semantic.workflow.failed",
          fires: "When a workflow fails at any step",
          payload: "{ type: \"workflow:failed\"; workflowId: string; error: string }",
        },
      ],
    },
    {
      category: "semantic.session",
      description: "Session-level events for tracking agent interaction boundaries.",
      events: [
        {
          kind: "semantic.session.started",
          fires: "When SemanticRegistry.startSession() runs (or your host emits the same)",
          payload: "{ type: \"session:started\"; sessionId: string }",
        },
        {
          kind: "semantic.session.ended",
          fires: "When SemanticRegistry.endSession(sessionId) runs",
          payload: "{ type: \"session:ended\"; sessionId: string }",
        },
        {
          kind: "semantic.session.heartbeat",
          fires: "Periodic signal that a session is still active",
          payload: "N/A (taxonomy-only, not yet in RuntimeEvent union)",
        },
      ],
    },
    {
      category: "semantic.intent",
      description: "Events for tracking expressed user/agent intents through their lifecycle.",
      events: [
        {
          kind: "semantic.intent.expressed",
          fires: "When a user or agent expresses an intent (e.g. \"I want to check out\")",
          payload: "{ type: \"intent:expressed\"; intentId: string; intent: string; metadata?: Record<string, unknown> }",
        },
        {
          kind: "semantic.intent.resolved",
          fires: "When an expressed intent is successfully fulfilled",
          payload: "{ type: \"intent:resolved\"; intentId: string }",
        },
        {
          kind: "semantic.intent.abandoned",
          fires: "When an intent is abandoned before resolution",
          payload: "{ type: \"intent:abandoned\"; intentId: string }",
        },
        {
          kind: "semantic.intent.failed",
          fires: "When an intent fails to resolve",
          payload: "{ type: \"intent:failed\"; intentId: string; error: string }",
        },
      ],
    },
    {
      category: "semantic.policy",
      description: "Events for policy evaluation outcomes.",
      events: [
        {
          kind: "semantic.policy.evaluated",
          fires: "When a policy evaluation completes (allowed or denied)",
          payload: "{ type: \"policy:evaluated\"; actionId: string; decision: PolicyDecision }",
        },
        {
          kind: "semantic.policy.denied",
          fires: "When a policy evaluation denies an action",
          payload: "{ type: \"policy:denied\"; actionId: string; reason: string }",
        },
      ],
    },
  ];

  return (
    <article className="max-w-3xl">
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        Event Taxonomy
      </h1>
      <p
        className="mt-4 text-lg leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Synqel Protocol defines <strong>20 event kinds</strong> across{" "}
        <strong>6 categories</strong>. Every operation on the semantic registry
        emits a typed <code style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>RuntimeEvent</code>{" "}
        that agents and observability tools can subscribe to.
      </p>

      {categories.map((cat) => (
        <section key={cat.category} className="mt-12">
          <h2
            className="text-2xl font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            <code style={{ fontFamily: "var(--font-mono)" }}>{cat.category}</code>
          </h2>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {cat.description}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm" style={{ color: "var(--color-text-secondary)" }}>
              <thead>
                <tr
                  className="border-b text-left"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <th className="pb-3 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Event Kind</th>
                  <th className="pb-3 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>When it fires</th>
                  <th className="pb-3 font-semibold" style={{ color: "var(--color-text-primary)" }}>Payload shape</th>
                </tr>
              </thead>
              <tbody>
                {cat.events.map((event) => (
                  <tr
                    key={event.kind}
                    className="border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <td className="py-3 pr-4">
                      <code
                        className="text-xs"
                        style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}
                      >
                        {event.kind}
                      </code>
                    </td>
                    <td className="py-3 pr-4">{event.fires}</td>
                    <td className="py-3">
                      <code
                        className="text-xs"
                        style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-muted)" }}
                      >
                        {event.payload}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Using the taxonomy in code
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          The SDK exports type-safe utilities for working with event kinds:
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <li>
            <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>EVENT_CATEGORIES</code> — readonly tuple of all 6 category strings
          </li>
          <li>
            <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>EVENT_KINDS</code> — readonly tuple of all 20 event kind strings
          </li>
          <li>
            <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>getCategoryFromKind(kind)</code> — extracts the category from an event kind
          </li>
          <li>
            <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>isValidEventKind(kind)</code> — type guard that checks if a string is a valid event kind
          </li>
        </ul>
      </section>
    </article>
  );
}
