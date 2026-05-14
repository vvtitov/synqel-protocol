import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import type { SemanticRegistry, PolicyContext } from "@synqel/sdk";
import { serializeSnapshotEnvelope } from "@synqel/sdk";

export type SynqelMcpServerOptions = {
  /** Used when `synqel_execute_action` omits `policyContext`. Defaults to `{ actor: "agent", roles: [] }`. */
  defaultPolicyContext?: PolicyContext;
};

/**
 * Registers MCP tools on an existing {@link McpServer}:
 * - `synqel_get_snapshot` — JSON envelope (`synqel.snapshot.v1`)
 * - `synqel_execute_action` — policy → validate optional Zod input → bound handler
 */
export function attachSynqelRegistryToMcpServer(
  server: McpServer,
  registry: SemanticRegistry,
  options?: SynqelMcpServerOptions,
): void {
  const defaultCtx = options?.defaultPolicyContext ?? {
    actor: "agent",
    roles: [],
  };

  server.registerTool(
    "synqel_get_snapshot",
    {
      description:
        "Returns the Synqel semantic registry snapshot (entities, actions including input JSON Schema when present, workflows, capabilities).",
    },
    async () => ({
      content: [{ type: "text", text: serializeSnapshotEnvelope(registry) }],
    }),
  );

  server.registerTool(
    "synqel_execute_action",
    {
      description:
        "Execute a registered Synqel action: evaluate policy, validate inputs against the action schema when defined, then invoke the bound handler.",
      inputSchema: {
        actionId: z.string(),
        input: z.record(z.string(), z.unknown()).optional(),
        policyContext: z
          .object({
            actor: z.enum(["human", "agent", "voice"]),
            roles: z.array(z.string()),
          })
          .optional(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const ctx = args.policyContext ?? defaultCtx;
      const result = await registry.executeAction(args.actionId, ctx, args.input, {
        sessionId: args.sessionId,
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );
}

/**
 * Stdio MCP server wired to the given registry. Host apps typically register entities/actions/handlers first, then start this process.
 */
export async function connectSynqelMcpStdio(
  registry: SemanticRegistry,
  options?: SynqelMcpServerOptions,
): Promise<McpServer> {
  const server = new McpServer(
    { name: "synqel", version: "0.1.0" },
    {
      instructions:
        "Synqel exposes your app's semantic registry over MCP: fetch the snapshot, then execute actions subject to policy and bindings.",
    },
  );
  attachSynqelRegistryToMcpServer(server, registry, options);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  return server;
}
