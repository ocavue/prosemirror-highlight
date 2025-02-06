import { Decoration } from 'prosemirror-view'
import { tokenize, SugarHigh } from 'sugar-high'

import type { Parser } from './types'

export type { Parser }

const types = SugarHigh.TokenTypes

export function createParser(): Parser {
  return function parser({ content, pos }) {
    const decorations: Decoration[] = []

    const tokens = tokenize(content)

    let from = pos + 1

    for (const [type, content] of tokens) {
      const to = from + content.length

      const decoration = Decoration.inline(from, to, {
        class: `sh__token--${types[type]}`,
        style: `color: var(--sh-${types[type]})`,
      })

      decorations.push(decoration)

      from = to
    }

    return decorations
  }
}
