import { getHighlighter, type Highlighter, type BuiltinLanguage } from 'shikiji'

import { createHighlightPlugin, type Parser } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/shikiji'

let highlighterPromise: Promise<void> | undefined
let highlighter: Highlighter | undefined
let parser: Parser | undefined
const loadedLanguages = new Set<string>()

/**
 * Lazy load highlighter and highlighter languages.
 *
 * When the highlighter or the required language is not loaded, it returns a
 * promise that resolves when the highlighter or the language is loaded.
 * Otherwise, it returns an array of decorations.
 */
const lazyParser: Parser = (options) => {
  if (!highlighterPromise) {
    highlighterPromise = getHighlighter({
      themes: ['vitesse-light'],
      langs: [],
    }).then((h) => {
      highlighter = h
    })
    return highlighterPromise
  }

  if (!highlighter) {
    return highlighterPromise
  }

  const language = options.language
  if (language && !loadedLanguages.has(language)) {
    return highlighter.loadLanguage(language as BuiltinLanguage).then(() => {
      loadedLanguages.add(language)
    })
  }

  if (!parser) {
    parser = createParser(highlighter)
  }

  return parser(options)
}

export const shikijiLazyPlugin = createHighlightPlugin({ parser: lazyParser })
