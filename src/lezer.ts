import type { Tree } from '@lezer/common'
import type { Highlighter } from '@lezer/highlight'
import { highlightTree } from '@lezer/highlight'
import { Decoration } from 'prosemirror-view'

import type { Parser, ParserOptions } from './types'

export type { Parser, ParserOptions }

export function createParser({
  parse,
  highlighter,
}: {
  parse: (options: ParserOptions) => Tree | undefined
  highlighter: Highlighter | readonly Highlighter[]
}): Parser {
  return function lezerParser(options) {
    const tree = parse(options)

    if (!tree) {
      return []
    }

    const decorations: Decoration[] = []
    const offset = options.pos + 1
    highlightTree(tree, highlighter, (from, to, classes) => {
      if (classes && from < to) {
        decorations.push(
          Decoration.inline(offset + from, offset + to, { class: classes }),
        )
      }
    })

    return decorations
  }
}
