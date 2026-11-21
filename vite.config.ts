import { playwright } from '@vitest/browser-playwright'
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
    include: ['test/**/*.spec.ts'],
    browser: {
      enabled: true,
      headless: !process.env.DEBUG,
      ui: false,
      provider: playwright({
        launchOptions: {
          // Opt into the new Chrome headless mode by using the "chromium" channel.
          // Along with `playwright install chromium --no-shell`, we only need to
          // download one copy of Chromium.
          // See https://playwright.dev/docs/browsers#chromium-new-headless-mode
          channel: 'chromium',
        },
      }),
      instances: [{ browser: 'chromium' }],
    },
  },

  build: {
    target: ['chrome100', 'safari15', 'firefox100'],
  },
})
