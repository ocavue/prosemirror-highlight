import { Decoration } from 'prosemirror-view'
import type { BundledLanguage, BundledTheme, Highlighter } from 'shiki'

import type { Parser } from './types'

export type { Parser }

export function createParser(
  highlighter: Highlighter,
  options?: { theme?: BundledTheme },
): Parser {
  return function parser({ content, language, pos }) {
    const decorations: Decoration[] = []

    const tokens = highlighter.codeToTokensBase(content, {
      lang: language as BundledLanguage,
      theme: options?.theme,
    })

    let from = pos + 1

    for (const line of tokens) {
      for (const token of line) {
        const to = from + token.content.length

        const decoration = Decoration.inline(from, to, {
          style: `color: ${token.color}`,
        })

        decorations.push(decoration)

        from = to
      }

      from += 1
    }

    return decorations
  }
}
