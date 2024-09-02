import { Decoration } from 'prosemirror-view'
import {
  type BundledLanguage,
  type BundledTheme,
  type CodeToTokensOptions,
  type Highlighter,
} from 'shiki'

import type { Parser } from './types'

export type { Parser }

export function createParser(
  highlighter: Highlighter,
  options?: CodeToTokensOptions<BundledLanguage, BundledTheme>,
): Parser {
  return function parser({ content, language, pos }) {
    const decorations: Decoration[] = []

    const { tokens } = highlighter.codeToTokens(content, {
      lang: language as BundledLanguage,

      // Use provided options for themes or just use first loaded theme
      ...(options ?? {
        theme: highlighter.getLoadedThemes()[0],
      }),
    })

    let from = pos + 1

    for (const line of tokens) {
      for (const token of line) {
        const to = from + token.content.length

        const decoration = Decoration.inline(from, to, {
          // When using `options.themes` the `htmlStyle` field will be set, otherwise `color` will be set
          style: token.htmlStyle ?? `color: ${token.color}`,
          class: 'shiki',
        })

        decorations.push(decoration)

        from = to
      }

      from += 1
    }

    return decorations
  }
}
