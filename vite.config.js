const path = require('path')
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.js'),
      name: 'quill-pagination',
      fileName: 'index'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['quill'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          Quill: 'quill'
        }
      }
    }
  }
})
