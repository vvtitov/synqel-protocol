import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  SemanticRegistry,
  getSemanticRegistry,
  resetSemanticRegistryForTests,
} from "../src/registry.js";
import type { RuntimeEvent } from "../src/types.js";

describe("SemanticRegistry", () => {
  let registry: SemanticRegistry;

  beforeEach(() => {
    registry = new SemanticRegistry();
  });

  describe("entities", () => {
    it("registers an entity and stores it", () => {
      const entity = registry.registerEntity({
        id: "product_1",
        type: "product",
        metadata: { price: 100 },
      });

      expect(entity.id).toBe("product_1");
      expect(entity.type).toBe("product");
      expect(entity.metadata).toEqual({ price: 100 });
      expect(registry.getEntity("product_1")).toEqual(entity);
    });

    it("applies default metadata when omitted", () => {
      const entity = registry.registerEntity({
        id: "item_1",
        type: "item",
      });

      expect(entity.metadata).toEqual({});
    });

    it("emits entity:registered event", () => {
      const events: RuntimeEvent[] = [];
      registry.bus.subscribe((e) => events.push(e));

      registry.registerEntity({ id: "e1", type: "widget" });

      expect(events).toHaveLength(1);
      expect(events[0]!.type).toBe("entity:registered");
    });

    it("emits entity:queried event on get", () => {
      registry.registerEntity({ id: "e1", type: "widget" });

      const events: RuntimeEvent[] = [];
      registry.bus.subscribe((e) => events.push(e));

      registry.getEntity("e1");

      expect(events).toHaveLength(1);
      expect(events[0]!.type).toBe("entity:queried");
    });

    it("does not emit entity:queried for missing entity", () => {
      const events: RuntimeEvent[] = [];
      registry.bus.subscribe((e) => events.push(e));

      const result = registry.getEntity("nonexistent");

      expect(result).toBeUndefined();
      expect(events).toHaveLength(0);
    });

    it("updates an entity", () => {
      registry.registerEntity({ id: "e1", type: "widget" });
      registry.updateEntity({ id: "e1", type: "updated_widget" });

      expect(registry.getEntity("e1")?.type).toBe("updated_widget");
    });

    it("removes an entity", () => {
      registry.registerEntity({ id: "e1", type: "widget" });
      const removed = registry.removeEntity("e1");

      expect(removed).toBe(true);
      expect(registry.getEntity("e1")).toBeUndefined();
    });

    it("returns false when removing nonexistent entity", () => {
      expect(registry.removeEntity("nope")).toBe(false);
    });

    it("rejects invalid entity", () => {
      expect(() => registry.registerEntity({ id: "", type: "x" })).toThrow();
      expect(() => registry.registerEntity({ id: "x", type: "" })).toThrow();
    });
  });

  describe("actions", () => {
    it("registers an action and stores it", () => {
      const action = registry.registerAction({
        id: "add_to_cart",
        intent: "mutation",
        deterministic: true,
      });

      expect(action.id).toBe("add_to_cart");
      expect(action.intent).toBe("mutation");
      expect(action.deterministic).toBe(true);
      expect(registry.getAction("add_to_cart")).toEqual(action);
    });

    it("defaults deterministic to true", () => {
      const action = registry.registerAction({
        id: "search",
        intent: "query",
      });

      expect(action.deterministic).toBe(true);
    });

    it("emits action:registered event", () => {
      const events: RuntimeEvent[] = [];
      registry.bus.subscribe((e) => events.push(e));

      registry.registerAction({ id: "a1", intent: "navigation" });

      expect(events).toHaveLength(1);
      expect(events[0]!.type).toBe("action:registered");
    });

    it("rejects invalid action", () => {
      expect(() =>
        registry.registerAction({ id: "", intent: "mutation" }),
      ).toThrow();
      expect(() =>
        registry.registerAction({ id: "x", intent: "invalid" }),
      ).toThrow();
    });
  });

  describe("capabilities", () => {
    it("registers capabilities", () => {
      const caps = registry.registerCapability({
        canSearch: true,
        canCheckout: true,
      });

      expect(caps.canSearch).toBe(true);
      expect(caps.canCheckout).toBe(true);
    });

    it("merges capabilities incrementally", () => {
      registry.registerCapability({ canSearch: true });
      registry.registerCapability({ canCheckout: true });

      const snapshot = registry.getSnapshot();
      expect(snapshot.capabilities.canSearch).toBe(true);
      expect(snapshot.capabilities.canCheckout).toBe(true);
    });

    it("emits capability:registered event", () => {
      const events: RuntimeEvent[] = [];
      registry.bus.subscribe((e) => events.push(e));

      registry.registerCapability({ canNavigate: true });

      expect(events).toHaveLength(1);
      expect(events[0]!.type).toBe("capability:registered");
    });
  });

  describe("workflows", () => {
    it("registers a workflow and stores it", () => {
      const workflow = registry.registerWorkflow({
        id: "checkout_flow",
        steps: ["add_to_cart", "confirm_order"],
      });

      expect(workflow.id).toBe("checkout_flow");
      expect(workflow.steps).toEqual(["add_to_cart", "confirm_order"]);
      expect(registry.getWorkflow("checkout_flow")).toEqual(workflow);
    });

    it("emits workflow:registered event", () => {
      const events: RuntimeEvent[] = [];
      registry.bus.subscribe((e) => events.push(e));

      registry.registerWorkflow({ id: "w1", steps: ["step1"] });

      expect(events).toHaveLength(1);
      expect(events[0]!.type).toBe("workflow:registered");
    });

    it("rejects workflow with empty steps", () => {
      expect(() =>
        registry.registerWorkflow({ id: "w1", steps: [] }),
      ).toThrow();
    });

    it("rejects workflow with empty step id", () => {
      expect(() =>
        registry.registerWorkflow({ id: "w1", steps: [""] }),
      ).toThrow();
    });
  });

  describe("snapshot", () => {
    it("returns a complete snapshot of all registered items", () => {
      registry.registerEntity({ id: "e1", type: "product" });
      registry.registerAction({ id: "a1", intent: "query" });
      registry.registerCapability({ canSearch: true });
      registry.registerWorkflow({ id: "w1", steps: ["step1"] });

      const snapshot = registry.getSnapshot();

      expect(snapshot.entities).toHaveLength(1);
      expect(snapshot.actions).toHaveLength(1);
      expect(snapshot.capabilities.canSearch).toBe(true);
      expect(snapshot.workflows).toHaveLength(1);
    });

    it("returns empty snapshot when nothing is registered", () => {
      const snapshot = registry.getSnapshot();

      expect(snapshot.entities).toHaveLength(0);
      expect(snapshot.actions).toHaveLength(0);
      expect(snapshot.capabilities).toEqual({});
      expect(snapshot.workflows).toHaveLength(0);
    });
  });

  describe("version tracking", () => {
    it("increments version on each registration", () => {
      expect(registry.getVersion()).toBe(0);

      registry.registerEntity({ id: "e1", type: "x" });
      expect(registry.getVersion()).toBe(1);

      registry.registerAction({ id: "a1", intent: "query" });
      expect(registry.getVersion()).toBe(2);
    });
  });

  describe("event bus", () => {
    it("unsubscribe stops receiving events", () => {
      const events: RuntimeEvent[] = [];
      const unsub = registry.bus.subscribe((e) => events.push(e));

      registry.registerEntity({ id: "e1", type: "x" });
      expect(events).toHaveLength(1);

      unsub();
      registry.registerEntity({ id: "e2", type: "y" });
      expect(events).toHaveLength(1);
    });
  });

  describe("reset", () => {
    it("clears all data and resets version", () => {
      registry.registerEntity({ id: "e1", type: "x" });
      registry.registerAction({ id: "a1", intent: "query" });
      registry.reset();

      expect(registry.getSnapshot().entities).toHaveLength(0);
      expect(registry.getSnapshot().actions).toHaveLength(0);
      expect(registry.getVersion()).toBe(0);
    });
  });
});

describe("singleton", () => {
  beforeEach(() => {
    resetSemanticRegistryForTests();
  });

  it("returns the same instance", () => {
    const a = getSemanticRegistry();
    const b = getSemanticRegistry();
    expect(a).toBe(b);
  });

  it("resetSemanticRegistryForTests creates a fresh instance", () => {
    const a = getSemanticRegistry();
    a.registerEntity({ id: "e1", type: "x" });

    resetSemanticRegistryForTests();

    const b = getSemanticRegistry();
    expect(b).not.toBe(a);
    expect(b.getSnapshot().entities).toHaveLength(0);
  });
});
