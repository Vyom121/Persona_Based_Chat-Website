import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // <-- add this line

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server:{
    proxy:{
      '/api':{
        target: 'http://backend:5000',
      changeOrigin: true,
      rewrite:(path)=>path.replace(/^\/api/,'')
    }
  }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src") // now works
    }
  }
});
