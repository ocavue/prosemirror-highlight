import { getHighlighter, setCDN } from 'shiki'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/shiki'

setCDN('https://unpkg.com/shiki@0.14.6/')

const highlighter = await getHighlighter({
  theme: 'github-light',
  langs: ['javascript', 'typescript', 'python'],
})
const parser = createParser(highlighter)
export const shikijiPlugin = createHighlightPlugin({ parser })
