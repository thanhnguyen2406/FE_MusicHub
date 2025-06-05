import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      buffer: 'buffer', 
    },
    mainFields: ['module', 'main', 'browser'],
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    include: ['buffer'],
  },
})
