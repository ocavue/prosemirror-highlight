import type { Parser as LezerParser } from '@lezer/common'
import { highlightTree } from '@lezer/highlight'
import type { Highlighter } from '@lezer/highlight'
import { Decoration } from 'prosemirror-view'

import type { Parser } from './types'

export type { Parser }

export function createParser(
  languageParsers: Record<string, LezerParser>,
  highlighter: Highlighter | readonly Highlighter[],
): Parser {
  return function parser({ content, language, pos }) {
    const lezerParser = language ? languageParsers[language] : undefined
    if (!lezerParser) {
      return []
    }

    const tree = lezerParser.parse(content)
    const decorations: Decoration[] = []

    highlightTree(tree, highlighter, (from, to, classes) => {
      decorations.push(
        Decoration.inline(pos + 1 + from, pos + 1 + to, { class: classes }),
      )
    })

    return decorations
  }
}
