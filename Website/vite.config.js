import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  // Allow overriding the base path at build time for GitHub Pages
  // Example: BASE_PATH=/my-repo/ npm run build
  const base = process.env.BASE_PATH || '/';
  return {
    base,
    plugins: [react()],
  };
});
