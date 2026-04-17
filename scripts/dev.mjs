import { spawn, spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(root, "..");
const nodeBin = process.execPath;

function start(command, args, env) {
  return spawn(command, args, {
    stdio: "inherit",
    env,
  });
}

const build = spawnSync(nodeBin, [path.join(projectRoot, "node_modules", "vite", "bin", "vite.js"), "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "development",
  },
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const serverEnv = {
  ...process.env,
  NODE_ENV: "development",
  PORT: process.env.PORT || "3000",
};

const server = start(nodeBin, [path.join(projectRoot, "dist", "index.js")], serverEnv);
const clientWatch = start(
  nodeBin,
  [path.join(projectRoot, "node_modules", "vite", "bin", "vite.js"), "build", "--watch"],
  {
    ...process.env,
    NODE_ENV: "development",
  }
);

const shutdown = () => {
  server.kill();
  clientWatch.kill();
  process.exit();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
