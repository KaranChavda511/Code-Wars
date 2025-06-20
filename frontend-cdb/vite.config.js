import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      "@": path.resolve(__dirname, 'src'),
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:2001',
    },
  }
});