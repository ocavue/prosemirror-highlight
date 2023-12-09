import { getHighlighter, setCDN } from 'shiki'

import { highlightPlugin } from '../src'
import { createDecorationBuilder } from '../src/shiki'

setCDN('https://unpkg.com/shiki@0.14.6/')

const highlighter = await getHighlighter({
  theme: 'github-light',
  langs: ['javascript', 'python'],
})

const builder = createDecorationBuilder(highlighter)
export const shikiPlugin = highlightPlugin(builder)
