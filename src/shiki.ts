import { Decoration } from 'prosemirror-view'
import { type Highlighter } from 'shiki'

import type { DecorationBuilder } from './types'

export function createDecorationBuilder(
  highlighter: Highlighter,
): DecorationBuilder {
  return function decorationBuilder({ content, language, pos }) {
    const decorations: Decoration[] = []

    const tokens = highlighter.codeToThemedTokens(
      content,
      language ?? undefined,
    )

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
