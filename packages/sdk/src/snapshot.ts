import type { SemanticRegistry, RegistrySnapshot } from "./registry.js";

/** Serializable envelope for HTTP, MCP, or cross-context sync. */
export type SynqelSnapshotEnvelope = {
  format: "synqel.snapshot.v1";
  registryVersion: number;
  snapshot: RegistrySnapshot;
};

export function createSnapshotEnvelope(
  registry: SemanticRegistry,
): SynqelSnapshotEnvelope {
  return {
    format: "synqel.snapshot.v1",
    registryVersion: registry.getVersion(),
    snapshot: registry.getSnapshot(),
  };
}

export function serializeSnapshotEnvelope(registry: SemanticRegistry): string {
  return JSON.stringify(createSnapshotEnvelope(registry));
}

/** Ready-made JSON `Response` for e.g. `GET /.synqel/snapshot` in Next.js or other runtimes. */
export function synqelSnapshotJsonResponse(
  registry: SemanticRegistry,
  init?: ResponseInit,
): Response {
  const body = serializeSnapshotEnvelope(registry);
  return new Response(body, {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init?.headers ?? {}),
    },
  });
}
