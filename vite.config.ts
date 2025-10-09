import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext', // This enables top-level await support
    minify: 'terser',
    cssCodeSplit: false
  },
  plugins: [
    react(),
    federation({
      name: 'portfolio-app',
      // Configure as host
      remotes: {
        spotifyApp: process.env.VITE_SPOTIFY_APP_URL || '',
      },
      shared: {
        'react': {},
        'react-dom': {},
        'styled-components': {},
      }
    }) as any,
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Proxy API requests to our backend server
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
