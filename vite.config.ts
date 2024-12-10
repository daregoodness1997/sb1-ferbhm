import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      entry: "dist-electron/main.cjs",
      vite: {
        build: {
          rollupOptions: {
            external: ["electron", "path"],
          },
        },
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    rollupOptions: {
      external: ["electron", "path"],
    },
  },
  resolve: {
    alias: {
      path: "path-browserify",
    },
  },
});
