import type { Tree } from '@lezer/common'
import { parser as cssParser } from '@lezer/css'
import { classHighlighter } from '@lezer/highlight'
import { parser as javascriptParser } from '@lezer/javascript'
import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser, type ParserOptions } from 'prosemirror-highlight/lezer'

function parse({ content, language }: ParserOptions): Tree | undefined {
  const lang = language?.toLowerCase() || ''
  if (['js', 'javascript', 'ts', 'typescript', 'jsx', 'tsx'].includes(lang)) {
    return javascriptParser.parse(content)
  }
  if (['css', 'scss', 'sass'].includes(lang)) {
    return cssParser.parse(content)
  }
}

const parser = createParser({ highlighter: classHighlighter, parse })
export const lezerPlugin = createHighlightPlugin({ parser })
