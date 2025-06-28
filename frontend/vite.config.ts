import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // your Spring Boot backend
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // remove '/api' prefix before forwarding
      }
    }
  }
})
