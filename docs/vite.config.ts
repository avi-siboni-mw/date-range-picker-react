import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const rootDir = import.meta.dirname
const workspaceRoot = resolve(rootDir, '..')
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': workspaceRoot,
      react: resolve(workspaceRoot, 'node_modules/react'),
      'react-dom': resolve(workspaceRoot, 'node_modules/react-dom'),
      'react/jsx-runtime': resolve(workspaceRoot, 'node_modules/react/jsx-runtime.js'),
      'react/jsx-dev-runtime': resolve(workspaceRoot, 'node_modules/react/jsx-dev-runtime.js')
    }
  },
  server: {
    fs: {
      allow: [workspaceRoot]
    }
  }
})
