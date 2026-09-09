import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `host: true` exposes the dev server on the LAN so a phone can reach it.
// Port 1421 keeps it clear of the desktop app's Vite server (1420).
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 1421 },
});
