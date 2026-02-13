import { withLineNumbers, createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/sugar-high'

const parser = withLineNumbers(createParser())
export const sugarHighPlugin = createHighlightPlugin({ parser })
