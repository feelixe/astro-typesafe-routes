import { parse } from "@astrojs/compiler";
import * as fs from "fs";
import { walk, is } from "@astrojs/compiler/utils";

const content = fs.readFileSync("./example/src/pages/index.astro", {
  encoding: "utf-8",
});

const result = await parse(content);

walk(result.ast, (node) => {
  // `tag` nodes are `element` | `custom-element` | `component`
  if (node.type === "frontmatter") {
    console.log(node);
  }
});
