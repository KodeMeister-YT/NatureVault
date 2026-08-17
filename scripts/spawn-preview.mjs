import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const child = spawn("npm", ["run", "preview", "--", "--port", "4173", "--strictPort"], {
  detached: true,
  stdio: "ignore",
  shell: true,
});
child.unref();
writeFileSync("scripts/preview.pid", String(child.pid), "utf-8");
console.log("Spawned preview server, pid", child.pid);
