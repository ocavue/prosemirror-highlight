import type { Tree } from '@lezer/common'
import { parser as cssParser } from '@lezer/css'
import { classHighlighter } from '@lezer/highlight'
import { parser as javascriptParser } from '@lezer/javascript'
import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser, type ParserOptions } from 'prosemirror-highlight/lezer'

function parse({ content, language }: ParserOptions): Tree | undefined {
  const lang = language?.toLowerCase() || ''
  switch (lang) {
    case 'js':
    case 'javascript':
    case 'ts':
    case 'typescript':
    case 'jsx':
    case 'tsx':
      return javascriptParser.parse(content)
    case 'css':
    case 'scss':
    case 'sass':
      return cssParser.parse(content)
    default:
      return undefined
  }
}

const parser = createParser({ highlighter: classHighlighter, parse })
export const lezerPlugin = createHighlightPlugin({ parser })
