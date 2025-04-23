import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 6017,
    host: "0.0.0.0",
    proxy: {
      '/api': {
        target: 'http://localhost:6016',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
