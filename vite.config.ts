import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["./src/assets/img/*", "./src/assets/other/*"],
      manifest: {
        name: "MacroDroid WC",
        short_name: "MDWC",
        background_color: "#3e526d",
        description:
          "Single page app that serves as a remote control to trigger MacroDroid actions on remote Android devices connected to internet and running the MacroDroid app with ease.",
        icons: [
          {
            src: "./src/assets/img/favicon.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "./src/assets/img/favicon.svg",
            type: "image/svg+xml",
          },
        ],
        theme_color: "#3e526d",
      },
      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],
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
