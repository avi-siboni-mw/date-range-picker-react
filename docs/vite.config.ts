import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const rootDir = import.meta.dirname
const workspaceRoot = resolve(rootDir, '..')
const docsNodeModules = resolve(rootDir, 'node_modules')
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': workspaceRoot,
      react: resolve(docsNodeModules, 'react'),
      'react-dom': resolve(docsNodeModules, 'react-dom'),
      'react-dom/client': resolve(docsNodeModules, 'react-dom/client.js'),
      'react/jsx-runtime': resolve(docsNodeModules, 'react/jsx-runtime.js'),
      'react/jsx-dev-runtime': resolve(docsNodeModules, 'react/jsx-dev-runtime.js')
    }
  },
  server: {
    fs: {
      allow: [workspaceRoot]
    }
  }
})
