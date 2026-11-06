import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SemanticRegistry } from "@synqel/sdk";
import { z } from "zod";

import { readFileSync } from "node:fs";

import {
  attachSynqelRegistryToMcpServer,
  SYNQEL_MCP_VERSION,
  type SynqelMcpServerOptions,
} from "../src/index.js";

type ExecPayload = { ok?: boolean; message?: string; data?: unknown };

function readText(result: Awaited<ReturnType<Client["callTool"]>>): string {
  const block = (result.content as Array<{ type: string; text?: string }> | undefined)?.[0];
  if (!block || block.type !== "text" || typeof block.text !== "string") {
    throw new Error("expected text content block");
  }
  return block.text;
}

function readExecPayload(result: Awaited<ReturnType<Client["callTool"]>>): ExecPayload {
  return JSON.parse(readText(result)) as ExecPayload;
}

async function setupClientAndServer(
  registry: SemanticRegistry,
  options?: SynqelMcpServerOptions,
) {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  const server = new McpServer({ name: "synqel-test", version: "0.0.0" }, {});
  attachSynqelRegistryToMcpServer(server, registry, options);

  await server.connect(serverTransport);

  const client = new Client({
    name: "vitest-client",
    version: "0.0.0",
  });
  await client.connect(clientTransport);

  return { client, server };
}

describe("attachSynqelRegistryToMcpServer", () => {
  let registry: SemanticRegistry;
  let client: Client;
  let server: McpServer;

  beforeEach(async () => {
    registry = new SemanticRegistry();
    const pair = await setupClientAndServer(registry);
    client = pair.client;
    server = pair.server;
  });

  afterEach(async () => {
    await Promise.all([
      client.close().catch(() => undefined),
      server.close().catch(() => undefined),
    ]);
  });

  it("advertises Synqel tools", async () => {
    const { tools } = await client.listTools();
    const names = tools!.map((t) => t.name).sort();

    expect(names).toContain("synqel_get_snapshot");
    expect(names).toContain("synqel_execute_action");
  });

  it("synqel_get_snapshot returns synqel.snapshot.v1 envelope", async () => {
    registry.registerEntity({ id: "e1", type: "demo" });

    const result = await client.callTool({
      name: "synqel_get_snapshot",
      arguments: {},
    });

    expect(result.isError).not.toBe(true);
    const block = result.content?.[0];
    expect(block?.type).toBe("text");
    if (!block || !("text" in block)) {
      throw new Error("expected text content block");
    }
    expect(typeof block.text).toBe("string");

    const envelope = JSON.parse((block as { text: string }).text) as {
      format?: string;
      snapshot?: unknown;
    };
    expect(envelope.format).toBe("synqel.snapshot.v1");
    expect(envelope.snapshot).toBeTruthy();
    const snap = envelope.snapshot as { entities: unknown[] };
    expect(snap.entities).toHaveLength(1);
  });

  it("synqel_execute_action runs bound handler with default policy context", async () => {
    registry.registerAction({ id: "ping", intent: "query" });
    registry.bindAction("ping", async () => ({ reached: true }));

    const result = await client.callTool({
      name: "synqel_execute_action",
      arguments: { actionId: "ping" },
    });

    expect(result.isError).not.toBe(true);
    const block = result.content?.[0];
    expect(block?.type).toBe("text");
    type ExecPayload = { ok?: boolean; data?: { reached?: boolean } };
    const payload = JSON.parse((block as { text: string }).text) as ExecPayload;
    expect(payload.ok).toBe(true);
    expect(payload.data).toEqual({ reached: true });
  });

  it("synqel_execute_action honors explicit policyContext", async () => {
    registry.registerAction({ id: "who", intent: "query" });
    registry.bindAction(
      "who",
      async (ctx, _input) => ({ actor: ctx.actor }),
    );

    const result = await client.callTool({
      name: "synqel_execute_action",
      arguments: {
        actionId: "who",
        policyContext: { actor: "human", roles: ["customer"] },
      },
    });

    expect(result.isError).not.toBe(true);
    const block = result.content?.[0];
    type ExecPayload = { ok?: boolean; data?: { actor?: string } };
    const payload = JSON.parse((block as { text: string }).text) as ExecPayload;
    expect(payload.ok).toBe(true);
    expect(payload.data?.actor).toBe("human");
  });

  it("synqel_get_snapshot exposes inputJsonSchema for actions with a Zod input schema", async () => {
    registry.registerAction({
      id: "add_to_cart",
      intent: "mutation",
      inputSchema: z.object({ sku: z.string() }),
    });

    const result = await client.callTool({ name: "synqel_get_snapshot", arguments: {} });

    const envelope = JSON.parse(readText(result)) as {
      snapshot: { actions: Array<{ id: string; inputJsonSchema?: { properties?: object } }> };
    };
    const action = envelope.snapshot.actions.find((a) => a.id === "add_to_cart");
    expect(action?.inputJsonSchema?.properties).toHaveProperty("sku");
  });

  it("synqel_execute_action passes sessionId into the handler context", async () => {
    registry.registerAction({ id: "session_probe", intent: "query" });
    registry.bindAction("session_probe", async (ctx) => ({
      sessionId: (ctx as { sessionId?: string }).sessionId,
    }));

    const result = await client.callTool({
      name: "synqel_execute_action",
      arguments: { actionId: "session_probe", sessionId: "sess_42" },
    });

    expect(readExecPayload(result)).toEqual({ ok: true, data: { sessionId: "sess_42" } });
  });

  describe("error paths", () => {
    it("returns ok:false for an unknown action", async () => {
      const result = await client.callTool({
        name: "synqel_execute_action",
        arguments: { actionId: "does_not_exist" },
      });

      const payload = readExecPayload(result);
      expect(payload.ok).toBe(false);
      expect(payload.message).toBe('Action "does_not_exist" not found in registry.');
    });

    it("denies an agent mutation without the admin role and never calls the handler", async () => {
      const handler = vi.fn(async () => ({ done: true }));
      registry.registerAction({ id: "delete_order", intent: "mutation" });
      registry.bindAction("delete_order", handler);

      const result = await client.callTool({
        name: "synqel_execute_action",
        arguments: { actionId: "delete_order" },
      });

      const payload = readExecPayload(result);
      expect(payload.ok).toBe(false);
      expect(payload.message).toBe(
        "Agents cannot execute mutation actions without the admin role.",
      );
      expect(handler).not.toHaveBeenCalled();
    });

    it("rejects input that fails the action's Zod schema and never calls the handler", async () => {
      const handler = vi.fn(async () => ({ done: true }));
      registry.registerAction({
        id: "lookup",
        intent: "query",
        inputSchema: z.object({ sku: z.string() }),
      });
      registry.bindAction("lookup", handler);

      const result = await client.callTool({
        name: "synqel_execute_action",
        arguments: { actionId: "lookup", input: { sku: 123 } },
      });

      const payload = readExecPayload(result);
      expect(payload.ok).toBe(false);
      expect(payload.message).toContain("sku");
      expect(handler).not.toHaveBeenCalled();
    });

    it("returns ok:false when no handler is bound", async () => {
      registry.registerAction({ id: "unbound", intent: "query" });

      const result = await client.callTool({
        name: "synqel_execute_action",
        arguments: { actionId: "unbound" },
      });

      expect(readExecPayload(result)).toEqual({
        ok: false,
        message: 'No handler bound for action "unbound".',
      });
    });

    it("returns ok:false with the error message when the handler throws", async () => {
      registry.registerAction({ id: "explode", intent: "query" });
      registry.bindAction("explode", async () => {
        throw new Error("payment gateway timeout");
      });

      const result = await client.callTool({
        name: "synqel_execute_action",
        arguments: { actionId: "explode" },
      });

      expect(readExecPayload(result)).toEqual({
        ok: false,
        message: "payment gateway timeout",
      });
    });

    it("returns an MCP tool error naming actionId when required arguments are missing", async () => {
      const result = await client.callTool({ name: "synqel_execute_action", arguments: {} });

      expect(result.isError).toBe(true);
      expect(readText(result)).toContain("actionId");
    });
  });
});

describe("SYNQEL_MCP_VERSION", () => {
  it("matches the version in the package manifest", () => {
    const manifest = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    ) as { version: string };

    expect(SYNQEL_MCP_VERSION).toBe(manifest.version);
  });
});

describe("attachSynqelRegistryToMcpServer with defaultPolicyContext", () => {
  it("uses the configured default context when policyContext is omitted", async () => {
    const registry = new SemanticRegistry();
    registry.registerAction({ id: "restock", intent: "mutation" });
    registry.bindAction("restock", async (ctx) => ({ roles: ctx.roles }));

    const { client, server } = await setupClientAndServer(registry, {
      defaultPolicyContext: { actor: "agent", roles: ["admin"] },
    });

    try {
      const result = await client.callTool({
        name: "synqel_execute_action",
        arguments: { actionId: "restock" },
      });

      expect(readExecPayload(result)).toEqual({ ok: true, data: { roles: ["admin"] } });
    } finally {
      await Promise.all([client.close(), server.close()]);
    }
  });
});
