import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
            return "react-core";
          }
          if (id.includes("react-router")) return "router";
          if (id.includes("@mui")) return "mui";
          if (id.includes("axios")) return "http";
        },
      },
    },
  },
});
