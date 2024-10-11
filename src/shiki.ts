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
          style: stringifyTokenStyle(
            token.htmlStyle ?? `color: ${token.color}`,
          ),
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

/**
 * Copied from https://github.com/shikijs/shiki/blob/f76a371dbc2752cba341023df00ebfe9b66cb3f6/packages/core/src/utils.ts#L213
 *
 * Copy instead of import it from `shiki` to avoid importing the `shiki` package in this file.
 */
function stringifyTokenStyle(token: string | Record<string, string>): string {
  if (typeof token === 'string') return token
  return Object.entries(token)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')
}
