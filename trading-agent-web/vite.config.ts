import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 开发环境代理配置
    proxy: {
      '/api/trading': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/api/coingecko': {
        target: 'https://api.coingecko.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coingecko/, '/api/v3'),
        headers: {
          'User-Agent': 'TradingDashboard/1.0'
        }
      },
      '/api/coincap': {
        target: 'https://api.coincap.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coincap/, '/v2'),
        headers: {
          'User-Agent': 'TradingDashboard/1.0'
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1600
  }
})
