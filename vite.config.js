import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 將 /api/qwen/* 代理至阿里雲 DashScope，解決瀏覽器 CORS 限制
      '/api/qwen': {
        target: 'https://dashscope.aliyuncs.com/compatible-mode',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/qwen/, ''),
      },
    },
  },
})
