import { $ } from "bun";
import * as path from "node:path";

const rootDir = import.meta.dir;
const packageDir = path.join(rootDir, "../../../../e2e-projects/v4-valid-path");

await $`bun run build`.cwd(packageDir);
