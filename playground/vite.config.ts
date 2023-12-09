import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      'prosemirror-highlight': '../src',
    },
  },
})
