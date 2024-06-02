import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://0.0.0.0:8081',
      '/ws': {
        target: 'ws://0.0.0.0:8081',
        ws: true,
      },
    },
  },
});
