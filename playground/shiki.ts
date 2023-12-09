import { getHighlighter, setCDN } from 'shiki'

import { highlightPlugin } from 'prosemirror-highlight'
import { createDecorationBuilder } from 'prosemirror-highlight/shiki'

setCDN('https://unpkg.com/shiki@0.14.6/')

const highlighter = await getHighlighter({
  theme: 'github-light',
  langs: ['javascript', 'typescript', 'python'],
})

const builder = createDecorationBuilder(highlighter)
export const shikiPlugin = highlightPlugin(builder)
