import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    base: "/",
    plugins: [react()],
    preview: {
      port: 8080,
      strictPort: true,
    },
    server: {
      port: 8080,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:8080",
    },
    proxy: {
      '/api': 'http://0.0.0.0:3000',
      '/ws': {
        target: 'ws://0.0.0.0:3000',
        ws: true,
      },
    },
  },
});
