import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 6017,
    proxy: {
      '/api': {
        target: 'http://localhost:5017',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:5017',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5017',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
}); 