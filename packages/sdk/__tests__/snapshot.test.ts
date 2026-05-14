import { describe, it, expect, beforeEach } from "vitest";
import { SemanticRegistry } from "../src/registry.js";
import {
  createSnapshotEnvelope,
  serializeSnapshotEnvelope,
  synqelSnapshotJsonResponse,
} from "../src/snapshot.js";

describe("snapshot envelope", () => {
  let registry: SemanticRegistry;

  beforeEach(() => {
    registry = new SemanticRegistry();
  });

  it("includes format, registryVersion, and snapshot", () => {
    registry.registerEntity({ id: "e", type: "widget" });
    const env = createSnapshotEnvelope(registry);
    expect(env.format).toBe("synqel.snapshot.v1");
    expect(env.registryVersion).toBeGreaterThan(0);
    expect(env.snapshot.entities).toHaveLength(1);
  });

  it("serializes to JSON", () => {
    registry.registerAction({ id: "a", intent: "query" });
    const raw = serializeSnapshotEnvelope(registry);
    const parsed = JSON.parse(raw) as ReturnType<typeof createSnapshotEnvelope>;
    expect(parsed.format).toBe("synqel.snapshot.v1");
    expect(parsed.snapshot.actions).toHaveLength(1);
  });

  it("synqelSnapshotJsonResponse sets JSON content-type", async () => {
    const res = synqelSnapshotJsonResponse(registry);
    expect(res.headers.get("content-type")).toContain("application/json");
    const body = await res.json();
    expect(body.format).toBe("synqel.snapshot.v1");
  });
});
