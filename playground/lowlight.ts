import 'highlight.js/styles/default.css'

import { common, createLowlight } from 'lowlight'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/lowlight'

const lowlight = createLowlight(common)
const parser = createParser(lowlight)
export const lowlightPlugin = createHighlightPlugin({ parser })
