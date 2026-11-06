import { describe, expectTypeOf, it } from "vitest";
import type { ExecuteActionErrorCode, ExecuteActionResult } from "../src/index.js";

declare const result: ExecuteActionResult;

describe("ExecuteActionResult", () => {
  it("guarantees code and message once ok is false", () => {
    if (!result.ok) {
      expectTypeOf(result.code).toEqualTypeOf<ExecuteActionErrorCode>();
      expectTypeOf(result.message).toEqualTypeOf<string>();
    }
  });

  it("carries data and no error code once ok is true", () => {
    if (result.ok) {
      expectTypeOf(result.data).toEqualTypeOf<unknown>();
      // @ts-expect-error a successful result has no error code
      void result.code;
    }
  });
});
