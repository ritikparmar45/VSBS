import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendURL = process.env.VITE_API_BASE || 'http://localhost:5000';

export default defineConfig({
  root: 'src', // because index.html is now in /src
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: backendURL,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist',  // tells Vite to output dist in root
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
