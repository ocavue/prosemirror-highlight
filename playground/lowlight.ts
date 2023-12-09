import { common, createLowlight } from 'lowlight'

import { highlightPlugin } from '../src'
import { createDecorationBuilder } from '../src/lowlight'

const lowlight = createLowlight(common)
const builder = createDecorationBuilder(lowlight)
export const lowlightPlugin = highlightPlugin(builder)
