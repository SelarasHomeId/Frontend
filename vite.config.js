import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Mengizinkan koneksi dari semua antarmuka
    port: 8000 // Sesuaikan dengan port yang Anda gunakan
  }
})