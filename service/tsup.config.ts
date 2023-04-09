import { defineConfig } from 'tsup'

module.exports = defineConfig({
  entryPoints: ['./src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  target: 'es2020',
  minify: false,
  splitting: false,
  sourcemap: true,
  shims: true,
  dts: false,
})
