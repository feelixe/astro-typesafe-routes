import { it, describe, expect, afterEach, jest } from "bun:test";
import { serialize } from "../src/search-serializer.ts";

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
		});

		expect(searchParams.size).toBe(2);
		expect(searchParams.get("age")).toBe("10");
		expect(searchParams.get("name")).toBe('"John"');
	});
});
