import { describe, it, expect } from "vitest";
import { isValidFunctionName } from "../src";

describe("isValidFunctionName", () => {
  it("returns true for valid function names", () => {
    expect(isValidFunctionName("myFunction")).toBe(true);
    expect(isValidFunctionName("_privateFunction")).toBe(true);
    expect(isValidFunctionName("$specialFunction")).toBe(true);
    expect(isValidFunctionName("function123")).toBe(true);
  });

  it("returns false for invalid function names", () => {
    expect(isValidFunctionName("123function")).toBe(false);
    expect(isValidFunctionName("function-name")).toBe(false);
    expect(isValidFunctionName("function name")).toBe(false);
    expect(isValidFunctionName("function!")).toBe(false);
  });
});
