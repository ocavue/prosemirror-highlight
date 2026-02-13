import { createHighlightPlugin, withLineNumbers } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/refractor'
import { refractor } from 'refractor/all'

const parser = withLineNumbers(createParser(refractor))
export const refractorPlugin = createHighlightPlugin({ parser })
