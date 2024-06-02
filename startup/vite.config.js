import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: false,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: 'http://service2:8081',
        secure: false,
      },
      '/ws': {
        target: 'ws://service2:8081',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
