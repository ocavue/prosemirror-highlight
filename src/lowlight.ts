import type { Root } from 'hast'
import type { Decoration } from 'prosemirror-view'

import { fillFromRoot } from './hast'
import type { Parser } from './types'

export type { Parser }

export type Lowlight = {
  highlight: (language: string, value: string) => Root
  highlightAuto: (value: string) => Root
}

export function createParser(lowlight: Lowlight): Parser {
  return function highlighter({ content, language, pos }) {
    const root = language
      ? lowlight.highlight(language, content)
      : lowlight.highlightAuto(content)

    const decorations: Decoration[] = []
    const from = pos + 1
    fillFromRoot(decorations, root, from)
    return decorations
  }
}
