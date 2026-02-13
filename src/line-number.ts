import { Decoration } from 'prosemirror-view'

import type { Parser, ParserOptions } from './types'

/**
 * Returns a new parser that adds line numbers to the parsed decorations.
 *
 * Line numbers are added as `<span class="line-number">` elements with
 * the line number as the text content.
 */
export function withLineNumbers(parser: Parser): Parser {
  return function parserWithLineNumbers(options: ParserOptions) {
    const parsed = parser(options)
    if (parsed && Array.isArray(parsed)) {
      const { pos, content } = options
      const start = pos + 1
      const lineStarts = [start]
      for (const match of content.matchAll(/(?:\r?\n)/g)) {
        lineStarts.push(start + match.index + match[0].length)
      }
      const decorations: Decoration[] = []
      for (const [index, lineStart] of lineStarts.entries()) {
        decorations.push(createLineStartWidget(lineStart, index + 1))
      }
      return [...decorations, ...parsed]
    }
    return parsed
  }
}

export function createLineStartWidget(
  from: number,
  lineNumber: number,
): Decoration {
  return Decoration.widget(from, () => createLineStartSpan(lineNumber), {
    key: 'line-number',
    side: -20,
  })
}

function createLineStartSpan(lineNumber: number) {
  const span = document.createElement('span')
  span.className = 'line-number'
  span.textContent = lineNumber.toString()
  return span
}
