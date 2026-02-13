import {
  classHighlighter,
  highlightTree,
  type Highlighter,
} from '@lezer/highlight'
import { Decoration } from 'prosemirror-view'

import type { Parser } from './types'

export type { Parser }

type LezerTree = Parameters<typeof highlightTree>[0]

export type LezerParser = {
  parse: (input: string) => LezerTree
}

export type LezerParserResolver =
  | LezerParser
  | Record<string, LezerParser>
  | ((language: string | undefined) => LezerParser | undefined)

export function createParser(
  parser: LezerParserResolver,
  highlighter: Highlighter | readonly Highlighter[] = classHighlighter,
): Parser {
  const resolveParser = createParserResolver(parser)

  return function lezerParser({ content, language, pos }) {
    const currentParser = resolveParser(language)
    if (!currentParser) {
      return []
    }

    const tree = currentParser.parse(content)
    const decorations: Decoration[] = []
    const fromOffset = pos + 1

    highlightTree(tree, highlighter, (from, to, classes) => {
      if (!classes || to <= from) {
        return
      }

      decorations.push(
        Decoration.inline(fromOffset + from, fromOffset + to, {
          class: classes,
        }),
      )
    })

    return decorations
  }
}

function createParserResolver(
  parser: LezerParserResolver,
): (language: string | undefined) => LezerParser | undefined {
  if (typeof parser === 'function') {
    return parser
  }

  if (isLezerParser(parser)) {
    return () => parser
  }

  return (language) => {
    if (!language) {
      return undefined
    }

    return parser[language] ?? parser[language.toLowerCase()]
  }
}

function isLezerParser(value: unknown): value is LezerParser {
  if (!value || typeof value !== 'object') {
    return false
  }

  return (
    'parse' in value &&
    typeof (value as { parse?: unknown }).parse === 'function'
  )
}
