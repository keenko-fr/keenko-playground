import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const WEB = join(ROOT, "apps", "web");
const ROUTE_TREE = join(WEB, "src", "routeTree.gen.ts");
const before = await readRouteTree();
let drifted = false;

try {
  const subprocess = Bun.spawn(["bun", "run", "build"], {
    cwd: WEB,
    stdout: "inherit",
    stderr: "inherit",
  });
  const exitCode = await subprocess.exited;
  if (exitCode !== 0) throw new Error(`Web codegen/build exited with code ${exitCode}`);
  const after = await readRouteTree();
  drifted = before !== after;
} finally {
  if (before === undefined) await rm(ROUTE_TREE, { force: true });
  else await writeFile(ROUTE_TREE, before);
}

if (drifted) {
  console.error("TanStack Router generated route tree drifted. Run `bun run codegen` and commit the generated change.");
  process.exitCode = 1;
}

async function readRouteTree() {
  try {
    return await readFile(ROUTE_TREE, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return undefined;
    throw error;
  }
}
