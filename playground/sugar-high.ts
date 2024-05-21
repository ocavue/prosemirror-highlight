import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/sugar-high'

const parser = createParser()
export const sugarHighPlugin = createHighlightPlugin({ parser })
