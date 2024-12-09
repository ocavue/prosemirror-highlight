import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/lowlight.ts',
    'src/refractor.ts',
    'src/shiki.ts',
    'src/sugar-high.ts',
  ],
  format: ['esm', 'cjs'],
  clean: true,
  dts: true,
})
