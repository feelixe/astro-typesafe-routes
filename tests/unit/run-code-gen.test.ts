import { describe, it, expect, mock } from "bun:test";
import { runCodeGen } from "../../src";
import * as fs from "node:fs/promises";

const pagesDir = "./src/pages";

mock.module("fast-glob", () => ({
  default: mock(() => [
    "./src/pages/index.astro",
    "./src/pages/posts/[id].astro",
  ]),
}));

const writeFile = mock(() => {});

mock.module("node:fs/promises", () => ({
  writeFile,
}));

describe("runCodeGen", () => {
  it("writes a file", async () => {
    await runCodeGen({
      pagesDir,
      outputPath: "./",
    });

    expect(fs.writeFile).toHaveBeenCalledTimes(1);

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
