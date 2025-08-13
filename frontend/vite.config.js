import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return ({
    plugins: [react()],
    build: {
      outDir: 'dist' // default, but let's make sure
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    },
  });
});
