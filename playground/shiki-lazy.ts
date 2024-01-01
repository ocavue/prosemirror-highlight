import { getHighlighter, setCDN, type Highlighter, type Lang } from 'shiki'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser, type Parser } from 'prosemirror-highlight/shiki'

setCDN('https://unpkg.com/shiki@0.14.6/')

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
      themes: ['github-light'],
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
    return highlighter.loadLanguage(language as Lang).then(() => {
      loadedLanguages.add(language)
    })
  }

  if (!parser) {
    parser = createParser(highlighter)
  }

  return parser(options)
}

export const shikiLazyPlugin = createHighlightPlugin({ parser: lazyParser })
