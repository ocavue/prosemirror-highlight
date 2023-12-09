import 'highlight.js/styles/default.css'

import { common, createLowlight } from 'lowlight'

import { highlightPlugin } from 'prosemirror-highlight'
import { createDecorationBuilder } from 'prosemirror-highlight/lowlight'

const lowlight = createLowlight(common)
const builder = createDecorationBuilder(lowlight)
export const lowlightPlugin = highlightPlugin(builder)
