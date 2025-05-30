import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: "http://backend2:8080",
        changeOrigin: true,
      },
      "/ws": {
        target: "ws://backend2:8080",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
