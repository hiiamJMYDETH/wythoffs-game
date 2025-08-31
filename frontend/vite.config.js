import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return ({
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist' // default, but let's make sure
    },
    preview: {
      allowedHosts: ['wythoffs-game.onrender.com'],
      port: process.env.PORT || 4173,
      host: true
    },
    server: {
      proxy: {
        "/api": {
          target: process.env.VITE_API_URL,
          changeOrigin: true,
          secure: true,
          host: true
        }
      }
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    },
  });
});
