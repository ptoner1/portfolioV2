import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'spotify_project',
      filename: 'remoteEntry.js',
      // Expose the components to be consumed by the host
      exposes: {
        './ProjectDetail': './src/components/ProjectDetail.tsx',
      },
      // Share dependencies with the host
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' } as any,
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' } as any,
        '@mui/material': { singleton: true, requiredVersion: '^5.14.19' } as any,
        '@emotion/react': { singleton: true, requiredVersion: '^11.11.1' } as any,
        '@emotion/styled': { singleton: true, requiredVersion: '^11.11.1' } as any
      } as any
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
