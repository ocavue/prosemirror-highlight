import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser, type Parser } from 'prosemirror-highlight/shiki'
import {
  createHighlighter,
  type BuiltinLanguage,
  type Highlighter,
} from 'shiki'

let highlighter: Highlighter | undefined
let parser: Parser | undefined

/**
 * Lazy load highlighter and highlighter languages.
 *
 * When the highlighter or the required language is not loaded, it returns a
 * promise that resolves when the highlighter or the language is loaded.
 * Otherwise, it returns an array of decorations.
 */
const lazyParser: Parser = (options) => {
  if (!highlighter) {
    return createHighlighter({
      themes: ['github-light', 'github-dark', 'github-dark-dimmed'],
      langs: [],
    }).then((h) => {
      highlighter = h
    })
  }

  const language = options.language as BuiltinLanguage
  if (language && !highlighter.getLoadedLanguages().includes(language)) {
    return highlighter.loadLanguage(language)
  }

  if (!parser) {
    parser = createParser(highlighter, {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
        dim: 'github-dark-dimmed',
      },
      defaultColor: 'dim',
    })
  }

  return parser(options)
}

export const shikiLazyPlugin = createHighlightPlugin({ parser: lazyParser })
