import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import https from 'https'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7030',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Connection', 'keep-alive');
          });
        },
        agent: new https.Agent({
          rejectUnauthorized: false,
        }),
      },
    },
  },
})