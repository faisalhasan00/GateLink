import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api/google-oauth': {
        target: 'https://oauth2.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/google-oauth/, ''),
      },
      '/api/fcm-send': {
        target: 'https://fcm.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fcm-send/, ''),
      },
    },
  },
});
