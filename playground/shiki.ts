import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/shiki'
import { getSingletonHighlighter } from 'shiki'

const highlighter = await getSingletonHighlighter({
  themes: ['github-light'],
  langs: ['javascript', 'typescript', 'python'],
})
const parser = createParser(highlighter)
export const shikiPlugin = createHighlightPlugin({ parser })
