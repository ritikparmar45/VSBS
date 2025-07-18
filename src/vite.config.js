import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendURL = process.env.VITE_API_BASE || 'https://vsbs.onrender.com';

export default defineConfig({
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
    outDir: 'dist',      // Will build into src/dist/
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
