import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        app: "./src/index.html",
      },
    },
  },
  server: {
    open: "./src/index.html",
  },
});
