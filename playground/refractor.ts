import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/refractor'
import { refractor } from 'refractor/lib/all'

const parser = createParser(refractor)
export const refractorPlugin = createHighlightPlugin({ parser })
