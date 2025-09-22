import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/quiz_front/',   // 👈 important for Tomcat subpath
})
