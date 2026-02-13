import type { CodeToTokensOptions, HighlighterGeneric } from '@shikijs/types'
import { Decoration } from 'prosemirror-view'

import type { Parser } from './types'

export type { Parser }

export function createParser<
  Language extends string = string,
  Theme extends string = string,
>(
  highlighter: HighlighterGeneric<Language, Theme>,
  options?: CodeToTokensOptions<Language, Theme>,
): Parser {
  return function parser({ content, language, pos, size }) {
    const decorations: Decoration[] = []

    const { tokens, fg, bg, rootStyle } = highlighter.codeToTokens(content, {
      lang: language as Language | undefined,

      // Use provided options for themes or just use first loaded theme
      ...(options ?? {
        theme: highlighter.getLoadedThemes()[0],
      }),
    })

    const style =
      rootStyle ||
      (fg && bg
        ? `--prosemirror-highlight:${fg};--prosemirror-highlight-bg:${bg}`
        : '')

    if (style) {
      const decoration = Decoration.node(pos, pos + size, { style })
      decorations.push(decoration)
    }

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
 * Copied from https://github.com/shikijs/shiki/blob/v3.22.0/packages/core/src/utils/tokens.ts#L151
 *
 * Copy instead of import it from `shiki` to avoid importing the `shiki` package in this file.
 */
function stringifyTokenStyle(token: string | Record<string, string>): string {
  if (typeof token === 'string') return token
  return Object.entries(token)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')
}
