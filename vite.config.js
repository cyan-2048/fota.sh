import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      onwarn(warning, handler) {
        if (typeof warning.code === "string" && warning.code.toLowerCase().includes("a11y")) return;
        handler(warning);
      },
    }),
  ],
  build: {
    outDir: "./docs",
    assetsDir: "./",
  },
  base: "./",
});
