import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "SaloneHub - Sierra Leone Civic Portal",
        short_name: "SaloneHub",
        description: "Browse Sierra Leone government services, find officials, and get AI assistance.",
        theme_color: "#059669",
        background_color: "#f8fafc",
        display: "standalone",
        orientation: "portrait-primary",
        icons: [
          { src: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
          { src: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) return "vendor-framer";
            if (id.includes("react") || id.includes("scheduler")) return "vendor-react";
            if (id.includes("leaflet") || id.includes("react-leaflet")) return "vendor-map";
            if (id.includes("lucide-react")) return "vendor-icons";
            if (id.includes("convex") || id.includes("@convex-dev")) return "vendor-convex";
            if (id.includes("i18next") || id.includes("react-i18next")) return "vendor-i18n";
            return "vendor-other";
          }
        },
      },
    },
  },
}));
