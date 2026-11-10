import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/subjects': 'http://127.0.0.1:8080',
      '/learning-path': 'http://127.0.0.1:8080',
      '/test': 'http://127.0.0.1:8080',
      '/ai': 'http://127.0.0.1:8080',
    }
  }
})
