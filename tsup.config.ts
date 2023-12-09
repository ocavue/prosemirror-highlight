import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/lowlight.ts', 'src/shiki.ts'],
  format: ['esm'],
  clean: true,
  dts: true,
})
