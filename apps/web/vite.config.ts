import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import process from 'node:process'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    host: true,
    port: Number(process.env.PORT) || 5173,
    strictPort: true
  },
  ssr: {
    noExternal: ['@kilo/ui', 'bits-ui', 'runed', 'svelte-toolbelt']
  }
})
