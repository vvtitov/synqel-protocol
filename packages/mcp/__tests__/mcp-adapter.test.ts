import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SemanticRegistry } from "@synqel/sdk";

import { attachSynqelRegistryToMcpServer } from "../src/index.js";

async function setupClientAndServer(registry: SemanticRegistry) {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  const server = new McpServer({ name: "synqel-test", version: "0.0.0" }, {});
  attachSynqelRegistryToMcpServer(server, registry);

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
});
