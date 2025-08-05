import { it, describe, expect, afterEach, jest } from "bun:test";
import { canStringifyBeSkipped, deserialize, serialize } from "../src/search-serializer.ts";

describe("deserialize", () => {
  it("returns correct values", () => {
    const search = deserialize(new URLSearchParams({ isActive: "true", foo: "bar" }));
    expect(search).toEqual({ isActive: true, foo: "bar" });
  });
});

describe("serialize", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns a URLSearchParams object", () => {
    const returnValue = serialize({});
    expect(returnValue).toBeInstanceOf(URLSearchParams);
  });

  it("returns an empty URLSearchParams object if passed an empty object", () => {
    const returnValue = serialize({});
    expect(returnValue.size).toBe(0);
  });

  it("serializes a json object to search params", () => {
    const searchParams = serialize({
      age: 10,
      name: "John",
      isActive: true,
      string: "true",
    });

    expect(searchParams.size).toBe(4);
    expect(searchParams.get("age")).toBe("10");
    expect(searchParams.get("name")).toBe("John");
    expect(searchParams.get("isActive")).toBe("true");
    expect(searchParams.get("string")).toBe('"true"');
  });
});

describe("canStringifyBeSkipped", () => {
  it("returns true for non special strings", () => {
    expect(canStringifyBeSkipped("John")).toBe(true);
  });

  it("returns false for strings that can be parsed", () => {
    expect(canStringifyBeSkipped("true")).toBe(false);
  });

  it("returns false for strings that can be parsed", () => {
    expect(canStringifyBeSkipped("4.44")).toBe(false);
  });
});
