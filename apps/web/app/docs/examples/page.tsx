import { CodeBlock } from "@/components/code-block";

const ECOMMERCE_CODE = `import {
  registerEntity,
  registerAction,
  registerCapability,
  registerWorkflow,
  getSemanticRegistry,
} from "@synqel/sdk";

// Register the product entity with price metadata
registerEntity({
  id: "product_123",
  type: "product",
  metadata: { name: "Wireless Headphones", price: 299, currency: "USD" },
});

// Register available actions with intent classes
registerAction({ id: "add_to_cart", intent: "mutation", deterministic: true });
registerAction({ id: "view_details", intent: "query", deterministic: true });
registerAction({ id: "go_checkout", intent: "navigation", deterministic: true });

// Declare what this app can do
registerCapability({ canSearch: true, canCheckout: true, canNavigate: true });

// Define the checkout workflow
registerWorkflow({
  id: "checkout_flow",
  steps: ["add_to_cart", "go_checkout", "confirm_order"],
});`;

const ECOMMERCE_SNAPSHOT = `{
  "format": "synqel.snapshot.v1",
  "registryVersion": 3,
  "snapshot": {
    "entities": [
      {
        "id": "product_123",
        "type": "product",
        "metadata": {
          "name": "Wireless Headphones",
          "price": 299,
          "currency": "USD"
        }
      }
    ],
    "actions": [
      { "id": "add_to_cart", "intent": "mutation", "deterministic": true },
      { "id": "view_details", "intent": "query", "deterministic": true },
      { "id": "go_checkout", "intent": "navigation", "deterministic": true }
    ],
    "capabilities": {
      "canSearch": true,
      "canCheckout": true,
      "canNavigate": true
    },
    "workflows": [
      {
        "id": "checkout_flow",
        "steps": ["add_to_cart", "go_checkout", "confirm_order"]
      }
    ]
  }
}`;

const ECOMMERCE_REACT = `import { useSemanticRuntime } from "@synqel/sdk/react";

function ProductPage() {
  const { snapshot, executeAction } = useSemanticRuntime();

  const product = snapshot.entities.find((e) => e.id === "product_123");

  return (
    <div>
      <h1>{product?.metadata.name as string}</h1>
      <p>\${product?.metadata.price as number}</p>
      <button
        type="button"
        onClick={() =>
          void executeAction("add_to_cart", { actor: "human", roles: ["customer"] })
        }
      >
        Add to Cart
      </button>
    </div>
  );
}`;

const FORM_CODE = `import {
  registerEntity,
  registerAction,
  registerWorkflow,
} from "@synqel/sdk";

// Register the form as an entity
registerEntity({
  id: "shipping_form",
  type: "form",
  metadata: {
    purpose: "collect_shipping_address",
    totalSteps: 4,
    currentStep: 1,
  },
});

// Register form actions
registerAction({ id: "fill_name", intent: "mutation", deterministic: true });
registerAction({ id: "fill_address", intent: "mutation", deterministic: true });
registerAction({ id: "fill_payment", intent: "mutation", deterministic: true });
registerAction({ id: "submit_form", intent: "mutation", deterministic: true });
registerAction({ id: "go_back", intent: "navigation", deterministic: true });

// Define the completion workflow
registerWorkflow({
  id: "form_completion",
  steps: ["fill_name", "fill_address", "fill_payment", "submit_form"],
});`;

const FORM_AI_EXAMPLE = `// What the AI agent understands from the snapshot:
// "This is a 4-step form. The user is on step 1.
//  The next action is fill_name (mutation).
//  The workflow is: fill_name → fill_address → fill_payment → submit_form.
//  I can guide: 'Please enter your name. This is step 1 of 4.'"

// The agent can also reason about navigation:
// "go_back is available as a navigation action.
//  I should offer it if the user wants to return to the previous step."`;

const DASHBOARD_CODE = `import {
  registerEntity,
  registerAction,
  registerCapability,
} from "@synqel/sdk";

// Register each dashboard section as an entity
registerEntity({
  id: "section_overview",
  type: "section",
  metadata: { label: "Overview", path: "/dashboard" },
});
registerEntity({
  id: "section_analytics",
  type: "section",
  metadata: { label: "Analytics", path: "/dashboard/analytics" },
});
registerEntity({
  id: "section_settings",
  type: "section",
  metadata: { label: "Settings", path: "/dashboard/settings" },
});

// Register a generic navigation action
registerAction({
  id: "navigate_to",
  intent: "navigation",
  deterministic: true,
});

registerCapability({ canNavigate: true });`;

const DASHBOARD_AI_EXAMPLE = `// AI agent interaction:
// User: "Take me to analytics"
//
// Agent reads the snapshot, finds:
//   entities: [
//     { id: "section_analytics", type: "section", metadata: { label: "Analytics", path: "/dashboard/analytics" } }
//   ]
//   actions: [{ id: "navigate_to", intent: "navigation" }]
//
// Agent resolves: executeAction("navigate_to", { actor: "agent", roles: ["viewer"] })
// Policy: navigation actions are allowed for all actors → { allowed: true }
// Event emitted: action:executed { actionId: "navigate_to" }`;

const DASHBOARD_REACT = `import { useSemanticRuntime, useSemanticEvents } from "@synqel/sdk/react";
import { useCallback } from "react";

function Dashboard() {
  const { snapshot, executeAction } = useSemanticRuntime();

  const sections = snapshot.entities.filter((e) => e.type === "section");

  const handleEvent = useCallback((event) => {
    if (event.type === "action:executed" && event.actionId === "navigate_to") {
      // perform actual navigation
    }
  }, []);

  useSemanticEvents(handleEvent);

  return (
    <nav>
      {sections.map((section) => (
        <button
          type="button"
          key={section.id}
          onClick={() =>
            void executeAction("navigate_to", { actor: "human", roles: ["viewer"] })
          }
        >
          {section.metadata.label as string}
        </button>
      ))}
    </nav>
  );
}`;

const HTTP_SNAPSHOT_CODE = `import { synqelSnapshotJsonResponse, getSemanticRegistry } from "@synqel/sdk";

export function GET() {
  return synqelSnapshotJsonResponse(getSemanticRegistry());
}`;

const AGENTS_MCP_CODE = `import {
  registerAction,
  bindAction,
  getSemanticRegistry,
} from "@synqel/sdk";
import { z } from "zod";
import { connectSynqelMcpStdio } from "@synqel/mcp";

registerAction({
  id: "submit_checkout",
  intent: "mutation",
  inputSchema: z.object({ cartId: z.string() }),
});

bindAction("submit_checkout", async (_ctx, input) => {
  const { cartId } = input as { cartId: string };
  return { paid: true, cartId };
});

async function main() {
  await connectSynqelMcpStdio(getSemanticRegistry(), {
    defaultPolicyContext: { actor: "agent", roles: ["admin"] },
  });
}

void main();`;

export default function ExamplesPage() {
  return (
    <article className="max-w-3xl">
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        Examples
      </h1>
      <p
        className="mt-4 text-lg leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Patterns for registering semantic surfaces, wiring React, exposing HTTP snapshots,
        and bridging MCP hosts — Synqel stays the contract; transport is your choice.
      </p>

      {/* E-commerce */}
      <section id="ecommerce" className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          E-commerce product page
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Register a product entity with price metadata, define add-to-cart and
          checkout actions, declare capabilities, and wire up a checkout
          workflow. This is the most common Synqel integration pattern.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          <CodeBlock code={ECOMMERCE_CODE} language="typescript" title="Registration" />
          <CodeBlock code={ECOMMERCE_SNAPSHOT} language="json" title="Envelope the AI agent receives" />
          <CodeBlock code={ECOMMERCE_REACT} language="typescript" title="React component" />
        </div>
      </section>

      {/* Multi-step form */}
      <section id="form" className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Multi-step form completion
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Model a multi-step form as an entity with step metadata, register each
          field-filling action, and define a workflow that gives the AI agent a
          clear path through the form.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          <CodeBlock code={FORM_CODE} language="typescript" title="Registration" />
          <CodeBlock code={FORM_AI_EXAMPLE} language="typescript" title="How the AI agent reasons" />
        </div>
      </section>

      {/* Dashboard navigation */}
      <section id="dashboard" className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Dashboard navigation
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Register dashboard sections as entities with path metadata, define a
          navigation action, and let AI agents resolve natural language
          navigation requests against the semantic surface.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          <CodeBlock code={DASHBOARD_CODE} language="typescript" title="Registration" />
          <CodeBlock code={DASHBOARD_AI_EXAMPLE} language="typescript" title="AI agent interaction" />
          <CodeBlock code={DASHBOARD_REACT} language="typescript" title="React component" />
        </div>
      </section>

      <section id="agents-mcp" className="mt-12">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Agents, HTTP, and MCP
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Same registry: serve JSON over HTTP for remote agents, or run{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>@synqel/mcp</code>{" "}
          so Claude Desktop / Cursor get{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>synqel_get_snapshot</code> and{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875em" }}>synqel_execute_action</code>.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          <CodeBlock code={HTTP_SNAPSHOT_CODE} language="typescript" title="Next.js route — snapshot envelope" />
          <CodeBlock code={AGENTS_MCP_CODE} language="typescript" title="MCP stdio bridge (sketch)" />
        </div>
      </section>
    </article>
  );
}
