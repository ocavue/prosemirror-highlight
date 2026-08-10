import { Decoration } from 'prosemirror-view'
import { SugarHigh, tokenize } from 'sugar-high/core'
import { lang, languages } from 'sugar-high/lang'
import type { Parser } from './types'


export type { Parser }

const types = SugarHigh.TokenTypes

export function createParser(): Parser {
  return function parser({ content, pos, language }) {
    const decorations: Decoration[] = []

    const languageId = language == null ? undefined : lang(language )
    const languageConfig = languageId && languages.find(lang => lang.id === languageId)?.config


    const tokens = tokenize(content, languageConfig )

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
