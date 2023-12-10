import { Decoration } from 'prosemirror-view'
import { type Highlighter } from 'shikiji'

import type { Parser } from './types'

export function createParser(highlighter: Highlighter): Parser {
  return function parser({ content, language, pos }) {
    const decorations: Decoration[] = []

    const tokens = highlighter.codeToThemedTokens(content, {
      lang: language,
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
