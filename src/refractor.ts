import type { Root } from 'hast'
import { Decoration } from 'prosemirror-view'
import type { Refractor } from 'refractor/lib/core'

import { fillFromRoot } from './hast'
import type { Parser } from './types'

export function createParser(refractor: Refractor): Parser {
  return function highlighter({ content, language, pos }) {
    const root = refractor.highlight(content, language || '')

    const decorations: Decoration[] = []
    const from = pos + 1

    // @ts-expect-error: the return value of `highlight` is not exactly a `hast.Root`
    const hastRoot: Root = root

    fillFromRoot(decorations, hastRoot, from)
    return decorations
  }
}
