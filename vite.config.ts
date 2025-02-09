import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // APIリクエストをバックエンドサーバーにプロキシ
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:8080', // バックエンドサーバーのURL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // /api プレフィックスを除去
      },
    },
  },
});