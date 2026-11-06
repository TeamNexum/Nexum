// `npm run bundle`: build the installers. NO_STRIP keeps linuxdeploy from
// stripping the AppImage (its bundled strip breaks on recent distros); it is
// harmless elsewhere. Set here rather than inline (`NO_STRIP=true tauri build`)
// so the script also runs from Windows shells.
import { spawnSync } from "node:child_process";

const result = spawnSync("tauri", ["build", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NO_STRIP: "true" },
});
process.exit(result.status ?? 1);
