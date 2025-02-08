import * as path from "node:path";
import { buildPackage } from "./project-utils.ts";

const ROOT_DIR = import.meta.dir;
const PACKAGE_DIR = path.join(ROOT_DIR, "../../");

await buildPackage({ packageDir: PACKAGE_DIR });
