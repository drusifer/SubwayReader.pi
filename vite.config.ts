import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  define: {
    // This allows the frontend to access process.env.API_KEY
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  }
});