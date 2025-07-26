import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      port: 3000,
      allowedHosts: [".ngrok-free.app"],
    },
    define: {
      // Make NODE_ENV available to the app
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    // Environment-specific build configurations
    build: {
      outDir: `dist/${mode}`,
      sourcemap: mode !== "production",
      minify: mode === "production" ? "esbuild" : false,
    },
    // Base URL for different environments
    base: env.VITE_BASE_URL || "/",
  };
});
