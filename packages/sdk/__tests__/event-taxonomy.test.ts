import { describe, it, expect } from "vitest";
import {
  EVENT_CATEGORIES,
  EVENT_KINDS,
  getCategoryFromKind,
  isValidEventKind,
} from "../src/event-taxonomy.js";
import type { EventCategory, EventKind } from "../src/event-taxonomy.js";

describe("getCategoryFromKind", () => {
  const expectedMappings: Array<[EventKind, EventCategory]> = [
    ["semantic.entity.registered", "semantic.entity"],
    ["semantic.entity.queried", "semantic.entity"],
    ["semantic.entity.updated", "semantic.entity"],
    ["semantic.entity.removed", "semantic.entity"],
    ["semantic.action.attempt", "semantic.action"],
    ["semantic.action.result", "semantic.action"],
    ["semantic.action.executed", "semantic.action"],
    ["semantic.workflow.started", "semantic.workflow"],
    ["semantic.workflow.step", "semantic.workflow"],
    ["semantic.workflow.completed", "semantic.workflow"],
    ["semantic.workflow.failed", "semantic.workflow"],
    ["semantic.session.started", "semantic.session"],
    ["semantic.session.ended", "semantic.session"],
    ["semantic.session.heartbeat", "semantic.session"],
    ["semantic.intent.expressed", "semantic.intent"],
    ["semantic.intent.resolved", "semantic.intent"],
    ["semantic.intent.abandoned", "semantic.intent"],
    ["semantic.intent.failed", "semantic.intent"],
    ["semantic.policy.evaluated", "semantic.policy"],
    ["semantic.policy.denied", "semantic.policy"],
  ];

  it.each(expectedMappings)(
    "maps %s → %s",
    (kind, expectedCategory) => {
      expect(getCategoryFromKind(kind)).toBe(expectedCategory);
    },
  );

  it("every EVENT_KIND maps to a valid EVENT_CATEGORY", () => {
    for (const kind of EVENT_KINDS) {
      const category = getCategoryFromKind(kind);
      expect(
        (EVENT_CATEGORIES as readonly string[]).includes(category),
      ).toBe(true);
    }
  });
});

describe("isValidEventKind", () => {
  it("returns true for all defined event kinds", () => {
    for (const kind of EVENT_KINDS) {
      expect(isValidEventKind(kind)).toBe(true);
    }
  });

  it("returns false for invalid event kinds", () => {
    expect(isValidEventKind("semantic.entity.deleted")).toBe(false);
    expect(isValidEventKind("not.a.real.kind")).toBe(false);
    expect(isValidEventKind("")).toBe(false);
    expect(isValidEventKind("semantic")).toBe(false);
  });
});

describe("taxonomy structure", () => {
  it("has 6 categories", () => {
    expect(EVENT_CATEGORIES).toHaveLength(6);
  });

  it("has 20 event kinds", () => {
    expect(EVENT_KINDS).toHaveLength(20);
  });

  it("all event kinds start with a valid category prefix", () => {
    for (const kind of EVENT_KINDS) {
      const category = getCategoryFromKind(kind);
      expect(kind.startsWith(category)).toBe(true);
    }
  });
});
