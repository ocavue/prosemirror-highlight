import {
  getSingletonHighlighter,
  type BuiltinLanguage,
  type Highlighter,
} from 'shiki'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser, type Parser } from 'prosemirror-highlight/shiki'

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
    return getSingletonHighlighter({
      themes: ['github-light'],
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
    parser = createParser(highlighter)
  }

  return parser(options)
}

export const shikiLazyPlugin = createHighlightPlugin({ parser: lazyParser })
