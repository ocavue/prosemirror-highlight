import { classHighlighter } from '@lezer/highlight'
import { parser as jsParser } from '@lezer/javascript'
import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/lezer'

const parser = createParser(
  { typescript: jsParser, javascript: jsParser },
  classHighlighter,
)
export const lezerPlugin = createHighlightPlugin({ parser })
