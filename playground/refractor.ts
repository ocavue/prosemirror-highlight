import { refractor } from 'refractor/all'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/refractor'

const parser = createParser(refractor)
export const refractorPlugin = createHighlightPlugin({ parser })
