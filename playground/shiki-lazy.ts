import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser, type Parser } from 'prosemirror-highlight/shiki'
import type { Decoration } from 'prosemirror-view'
import {
  createHighlighter,
  type BuiltinLanguage,
  type Highlighter,
} from 'shiki'

let highlighter: Highlighter | undefined
let highlighterPromise: Promise<void> | undefined
let parser: Parser | undefined
const loadedLanguages = new Set<string>()

/**
 * Lazy load highlighter and highlighter languages.
 *
 * When the highlighter or the required language is not loaded, it returns a
 * promise that resolves when the highlighter or the language is loaded.
 * Otherwise, it returns an array of decorations.
 */
const lazyParser: Parser = (options): Promise<void> | Decoration[] => {
  if (!highlighter) {
    if (!highlighterPromise) {
      highlighterPromise = createHighlighter({
        themes: ['github-light', 'github-dark', 'github-dark-dimmed'],
        langs: [],
      }).then((h) => {
        highlighter = h
      })
    }
    return highlighterPromise
  }

  const language = options.language as BuiltinLanguage
  if (language && !loadedLanguages.has(language)) {
    return highlighter.loadLanguage(language).finally(() => {
      loadedLanguages.add(language)
    })
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
