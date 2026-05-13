import { describe, it, expect } from "vitest";
import { evaluatePolicy } from "../src/policy.js";
import type { PolicyContext, PolicyRule, SemanticAction } from "../src/types.js";

const mutationAction: SemanticAction = {
  id: "delete_item",
  intent: "mutation",
  deterministic: true,
};

const queryAction: SemanticAction = {
  id: "search_items",
  intent: "query",
  deterministic: true,
};

const navigationAction: SemanticAction = {
  id: "go_home",
  intent: "navigation",
  deterministic: true,
};

describe("evaluatePolicy", () => {
  describe("default rule", () => {
    it("blocks agent mutation without admin role", () => {
      const ctx: PolicyContext = { actor: "agent", roles: ["viewer"] };
      const decision = evaluatePolicy(ctx, mutationAction);

      expect(decision.allowed).toBe(false);
      if (!decision.allowed) {
        expect(decision.reason).toContain("admin");
      }
    });

    it("allows agent mutation with admin role", () => {
      const ctx: PolicyContext = { actor: "agent", roles: ["admin"] };
      const decision = evaluatePolicy(ctx, mutationAction);

      expect(decision.allowed).toBe(true);
    });

    it("allows human mutation without admin role", () => {
      const ctx: PolicyContext = { actor: "human", roles: ["viewer"] };
      const decision = evaluatePolicy(ctx, mutationAction);

      expect(decision.allowed).toBe(true);
    });

    it("allows agent query without admin role", () => {
      const ctx: PolicyContext = { actor: "agent", roles: [] };
      const decision = evaluatePolicy(ctx, queryAction);

      expect(decision.allowed).toBe(true);
    });

    it("allows agent navigation without admin role", () => {
      const ctx: PolicyContext = { actor: "agent", roles: [] };
      const decision = evaluatePolicy(ctx, navigationAction);

      expect(decision.allowed).toBe(true);
    });

    it("allows voice actor mutation", () => {
      const ctx: PolicyContext = { actor: "voice", roles: [] };
      const decision = evaluatePolicy(ctx, mutationAction);

      expect(decision.allowed).toBe(true);
    });
  });

  describe("custom rules", () => {
    it("custom rule can deny an action", () => {
      const ownerOnly: PolicyRule = (ctx, action) => {
        if (
          action.id === "delete_item" &&
          !ctx.roles.includes("owner")
        ) {
          return { allowed: false, reason: "Only owners can delete." };
        }
        return null;
      };

      const ctx: PolicyContext = { actor: "human", roles: ["viewer"] };
      const decision = evaluatePolicy(ctx, mutationAction, [ownerOnly]);

      expect(decision.allowed).toBe(false);
      if (!decision.allowed) {
        expect(decision.reason).toBe("Only owners can delete.");
      }
    });

    it("custom rules compose — first denial wins", () => {
      const ruleA: PolicyRule = (_ctx, _action) => null;
      const ruleB: PolicyRule = (_ctx, _action) => ({
        allowed: false,
        reason: "Rule B denied.",
      });
      const ruleC: PolicyRule = (_ctx, _action) => ({
        allowed: false,
        reason: "Rule C denied.",
      });

      const ctx: PolicyContext = { actor: "human", roles: [] };
      const decision = evaluatePolicy(ctx, queryAction, [
        ruleA,
        ruleB,
        ruleC,
      ]);

      expect(decision.allowed).toBe(false);
      if (!decision.allowed) {
        expect(decision.reason).toBe("Rule B denied.");
      }
    });

    it("passes when all custom rules return null", () => {
      const passThrough: PolicyRule = (_ctx, _action) => null;

      const ctx: PolicyContext = { actor: "human", roles: [] };
      const decision = evaluatePolicy(ctx, queryAction, [
        passThrough,
        passThrough,
      ]);

      expect(decision.allowed).toBe(true);
    });

    it("custom rules run before default rule", () => {
      const customAllow: PolicyRule = (_ctx, _action) => null;

      const ctx: PolicyContext = { actor: "agent", roles: [] };
      const decision = evaluatePolicy(ctx, mutationAction, [customAllow]);

      expect(decision.allowed).toBe(false);
    });
  });
});
