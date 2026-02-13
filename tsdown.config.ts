import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/lowlight.ts',
    'src/refractor.ts',
    'src/shiki.ts',
    'src/sugar-high.ts',
  ],
  platform: 'neutral',
  format: ['esm'],
})
