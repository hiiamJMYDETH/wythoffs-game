import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Only enable HMR if not in production
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [react()],
  base: '/',  // Adjust base URL for static assets
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  server: {
    hmr: isDev, // Enable HMR only for local development
  },
});
