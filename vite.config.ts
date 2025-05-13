import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'portfolio-app',
      // Configure as host
      remotes: {
        // Remote modules will be defined here, example:
        // spotifyProject: 'http://localhost:5001/assets/remoteEntry.js',
      },
      shared: {
        // Shared dependencies between host and remotes
        react: { singleton: true, requiredVersion: '^18.2.0' } as any,
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' } as any,
        '@mui/material': { singleton: true, requiredVersion: '^5.14.19' } as any,
        '@emotion/react': { singleton: true, requiredVersion: '^11.11.1' } as any,
        '@emotion/styled': { singleton: true, requiredVersion: '^11.11.1' } as any
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
