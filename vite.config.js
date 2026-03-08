import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const DEFAULT_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const baseUrl = env.VITE_DASHSCOPE_BASE_URL || env.DASHSCOPE_BASE_URL || DEFAULT_BASE_URL
  const proxyTarget = baseUrl.replace(/\/v1\/?$/, '')
  const devKey = env.VITE_DASHSCOPE_API_KEY || env.DASHSCOPE_API_KEY || ''

  return {
    plugins: [react()],
    server: {
      proxy: {
        // 將 /api/qwen/* 代理至 DashScope（區域由 baseUrl 控制）
        '/api/qwen': {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/qwen/, ''),
          configure(proxy) {
            if (!devKey) return
            proxy.on('proxyReq', proxyReq => {
              if (!proxyReq.getHeader('Authorization')) {
                proxyReq.setHeader('Authorization', `Bearer ${devKey}`)
              }
            })
          },
        },
      },
    },
  }
})
