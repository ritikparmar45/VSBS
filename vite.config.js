import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get the backend URL from .env file during production
const backendURL = process.env.VITE_API_BASE || 'http://localhost:5000';

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
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
