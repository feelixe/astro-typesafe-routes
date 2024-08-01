import * as path from "path";
import { describe, vi, it, expect } from "vitest";
import { runCodeGen } from "../src/index";
import * as fs from "node:fs/promises";

const pagesDir = "./src/pages";

vi.mock("node:fs/promises", () => ({
  writeFile: vi.fn(),
  readdir: vi.fn().mockImplementation((searchPath: string) => {
    if (searchPath === pagesDir) {
      return [
        {
          name: "index.astro",
          isDirectory: () => false,
        },
        {
          name: "posts",
          isDirectory: () => true,
        },
      ];
    }

    if (searchPath === path.join(pagesDir, "posts")) {
      return [
        {
          name: "[id].astro",
          isDirectory: () => false,
        },
        {
          name: "info.txt",
          isDirectory: () => false,
        },
      ];
    }

    return [];
  }),
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
