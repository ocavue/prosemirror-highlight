import type { Root } from 'hast'
import type { Decoration } from 'prosemirror-view'
import type { Refractor } from 'refractor/core'

import { fillFromRoot } from './hast'
import type { Parser } from './types'

export type { Parser }

export function createParser(refractor: Refractor): Parser {
  return function highlighter({ content, language, pos }) {
    const root: Root = refractor.highlight(content, language || '')

    const decorations: Decoration[] = []
    const from = pos + 1

    fillFromRoot(decorations, root, from)
    return decorations
  }
}
