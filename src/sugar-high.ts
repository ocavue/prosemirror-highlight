import { Decoration } from 'prosemirror-view'
import { tokenize } from 'sugar-high'

import type { Parser } from './types'

export type { Parser }

/**
 * Copied from https://github.com/huozhi/sugar-high/blob/v0.6.1/lib/index.js#L80-L107
 */
const types = [
  'identifier',
  'keyword',
  'string',
  'class',
  'property',
  'entity',
  'jsxliterals',
  'sign',
  'comment',
  'break',
  'space',
] as const

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
