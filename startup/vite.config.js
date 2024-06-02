import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/ws': {
        target: 'ws://localhost:8081',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
