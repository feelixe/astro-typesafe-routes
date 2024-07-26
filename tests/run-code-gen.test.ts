import * as path from "path";
import { describe, vi, it, expect } from "vitest";
import { runCodeGen } from "../src/index";
import * as fs from "node:fs/promises";

const pagesPath = "./src/pages";

vi.mock("node:fs/promises", () => ({
  writeFile: vi.fn(),
  readdir: vi.fn().mockImplementation((searchPath: string) => {
    if (searchPath === pagesPath) {
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

    if (searchPath === path.join(pagesPath, "posts")) {
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
      pagesPath,
      outPath: "./",
      name: "$path",
      trailingSlash: false,
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
      pagesPath,
      outPath: "./",
      name: "$path",
      trailingSlash: false,
    });

    expect(routes).toEqual([
      { path: "/", params: null },
      { path: "/posts/[id]", params: ["id"] },
    ]);
  });
});
