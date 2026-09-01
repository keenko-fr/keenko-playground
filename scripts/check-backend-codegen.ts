import { cp, mkdtemp, readdir, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";

const ROOT = new URL("..", import.meta.url).pathname;
const BACKEND = join(ROOT, "packages", "backend");
const GENERATED = [join(BACKEND, "confect", "_generated"), join(BACKEND, "convex")];

const backupRoot = await mkdtemp(join(tmpdir(), "keenko-codegen-"));
const before = await snapshot(GENERATED);

try {
  for (const path of GENERATED) {
    await cp(path, join(backupRoot, relative(BACKEND, path)), { recursive: true });
  }

  const process = Bun.spawn(["bun", "run", "codegen"], {
    cwd: BACKEND,
    stdout: "inherit",
    stderr: "inherit",
  });
  const exitCode = await process.exited;
  if (exitCode !== 0) process.exit(exitCode);

  const after = await snapshot(GENERATED);
  if (JSON.stringify(after) !== JSON.stringify(before)) {
    console.error("Confect generated output drifted. Run `bun run codegen` and commit the generated changes.");
    process.exitCode = 1;
  }
} finally {
  for (const path of GENERATED) {
    await rm(path, { recursive: true, force: true });
    await cp(join(backupRoot, relative(BACKEND, path)), path, { recursive: true });
  }
  await rm(backupRoot, { recursive: true, force: true });
}

async function snapshot(roots: string[]) {
  const entries: Array<readonly [string, string]> = [];
  for (const root of roots) {
    for (const file of await files(root)) {
      const path = relative(BACKEND, file).replaceAll("\\", "/");
      const hash = createHash("sha256").update(await readFile(file)).digest("hex");
      entries.push([path, hash]);
    }
  }
  return entries.sort(([left], [right]) => left.localeCompare(right));
}

async function files(root: string): Promise<string[]> {
  const out: string[] = [];
  if (!(await exists(root))) return out;
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) out.push(...(await files(path)));
    else if (entry.isFile()) out.push(path);
  }
  return out.sort();
}

async function exists(path: string) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}
