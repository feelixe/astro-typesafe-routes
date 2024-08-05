import { describe, vi, it, expect, Mock } from "vitest";
import { runCodeGen } from "../src/index";
import * as fs from "node:fs/promises";
import fastGlob from "fast-glob";

const pagesDir = "./src/pages";

vi.mock("fast-glob");
const mockedFastGlob = fastGlob as unknown as Mock;
mockedFastGlob.mockReturnValue([
  "./src/pages/index.astro",
  "./src/pages/posts/[id].astro",
]);

vi.mock("node:fs/promises", () => ({
  writeFile: vi.fn(),
}));

describe("runCodeGen", () => {
  it("writes a file", async () => {
    await runCodeGen({
      pagesDir,
      outputPath: "./",
    });

    expect(fs.writeFile).toHaveBeenCalledOnce();

    expect(fs.writeFile).toHaveBeenCalledWith(
      "./",
      expect.any(String),
      expect.objectContaining({ encoding: "utf-8" }),
    );
  });
  it("returns correct routes", async () => {
    const routes = await runCodeGen({
      pagesDir,
      outputPath: "./",
    });

    expect(routes).toEqual([
      { path: "/", params: null },
      { path: "/posts/[id]", params: ["id"] },
    ]);
  });
});
