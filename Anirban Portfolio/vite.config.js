import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Anirban-Portfolio/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: [
      'unplighted-bess-overneglectfully.ngrok-free.dev',
    ],
  },
})
