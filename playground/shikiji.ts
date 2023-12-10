import { getHighlighter } from 'shikiji'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/shikiji'

const highlighter = await getHighlighter({
  themes: ['vitesse-light'],
  langs: ['javascript', 'typescript', 'python'],
})
const parser = createParser(highlighter)
export const shikijiPlugin = createHighlightPlugin({ parser })
