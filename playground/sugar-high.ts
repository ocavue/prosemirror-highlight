import { createParser } from 'prosemirror-highlight/sugar-high'

import { createHighlightPlugin } from 'prosemirror-highlight'

const parser = createParser()
export const sugarHighPlugin = createHighlightPlugin({ parser })
