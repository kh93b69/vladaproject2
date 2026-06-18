import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    // Railway provides the host via env; allow all hosts so the proxy works.
    allowedHosts: true,
  },
  server: {
    // В dev (`npm run dev`) запросы статистики уходят на локальный сервер,
    // если он запущен (`npm run start`). Не критично для прода.
    proxy: {
      '/api': 'http://localhost:4173',
    },
  },
})
