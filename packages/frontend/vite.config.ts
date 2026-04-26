import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@connecta/design-system': path.resolve(__dirname, '../design-system/src/index.ts'),
    },
  },
  server: {
    fs: {
      allow: ['../..'],
    },
  },
})
