import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: './playground',

  resolve: {
    alias: {
      'prosemirror-highlight': '../src',
    },
  },

  test: {
    root: './',
    environment: 'jsdom',
  },

  build: {
    target: ['chrome100', 'safari15', 'firefox100'],
  },
})
