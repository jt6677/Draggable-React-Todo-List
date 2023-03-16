import alias from '@rollup/plugin-alias'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
// https://vitejs.dev/config/

const projectRootDir = resolve(__dirname)
export default defineConfig({
  plugins: [
    react(),
    alias({
      entries: [
        {
          find: '~',
          replacement: resolve(projectRootDir, 'src'),
        },
      ],
    }),
  ],
  define: {
    // global: {},
    'process.env': process.env,
  },
  // [find: string]: string

  server: {
    host: true,
    port: 3000,
  },
})
