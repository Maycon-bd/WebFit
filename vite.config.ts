import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'supabase', test: /node_modules[\\/]@supabase[\\/]/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom)[\\/]/ },
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
})
