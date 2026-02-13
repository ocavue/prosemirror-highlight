import type { Tree } from '@lezer/common'
import { parser as cssParser } from '@lezer/css'
import { classHighlighter } from '@lezer/highlight'
import { parser as javascriptParser } from '@lezer/javascript'
import {
  createHighlightPlugin,
  type ParserOptions,
} from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/lezer'

function parse({ content, language }: ParserOptions): Tree | undefined {
  const lang = language?.toLowerCase() || ''
  if (['js', 'javascript', 'ts', 'typescript', 'jsx', 'tsx'].includes(lang)) {
    return javascriptParser.parse(content)
  }
  if (['css'].includes(lang)) {
    return cssParser.parse(content)
  }
}

const parser = createParser({ parse, highlighter: classHighlighter })
export const lezerPlugin = createHighlightPlugin({ parser })
