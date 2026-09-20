import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // So frontend can call "/api/..." without hardcoding the backend URL
      "/api": {
        target: "http://localhost:7000",
        changeOrigin: true,
      },
    },
  },
});
