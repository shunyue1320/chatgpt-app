import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// const mobile = process.env.TAURI_PLATFORM === 'android'
//   || process.env.TAURI_PLATFORM === 'ios';

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, process.cwd())

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [vue()],
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    // prevent vite from obscuring rust errors
    clearScreen: false,
    // tauri expects a fixed port, fail if that port is not available
    server: {
      host: '0.0.0.0',
      port: 3011,
      strictPort: true,
      proxy: {
        '/api': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, // 允许跨域
          rewrite: path => path.replace('/api/', '/'),
        },
      },
    },
    // to make use of `TAURI_DEBUG` and other env variables
    // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
    envPrefix: ['VITE_', 'TAURI_'],
    build: {
      // Tauri supports es2021
      target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
      // don't minify for debug builds
      minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
      // produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_DEBUG,
    },
  }
})
