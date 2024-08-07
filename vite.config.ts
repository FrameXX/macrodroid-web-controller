import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        app: "./src/index.html",
      },
    },
  },
  server: {
    open: "./src/index.html",
  },
  publicDir: "./src/assets/public",
});
