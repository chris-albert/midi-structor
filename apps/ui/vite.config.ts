/// <reference types='vitest' />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/ui',
  // base: 'https://chris-albert.github.io/midi-structor/',
  base: './',
  server: {
    port: 3000,
    host: 'localhost',
    hmr: false, // this needs to be false for webworker dev
  },
  plugins: [
    react(),
    nodePolyfills(),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.json',
      },
    }),
  ],
  worker: {
    plugins: [],
    format: 'es',
    rollupOptions: {
      makeAbsoluteExternalsRelative: true,
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
