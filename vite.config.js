import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import path from "path";

export default defineConfig({
  plugins: [
    electron({
      entry: "electron/main.js",
    }),
  ],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
