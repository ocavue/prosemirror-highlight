import { createHighlightPlugin, withLineNumbers } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/shiki'
import { getSingletonHighlighter } from 'shiki'

const highlighter = await getSingletonHighlighter({
  themes: ['ayu-light'],
  langs: ['javascript', 'typescript', 'python'],
})
const parser = withLineNumbers(createParser(highlighter))
export const shikiPlugin = createHighlightPlugin({ parser })
