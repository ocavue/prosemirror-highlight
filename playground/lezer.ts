import { parser as javascript } from '@lezer/javascript'
import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/lezer'

const parser = createParser({
  javascript,
  typescript: javascript.configure({ dialect: 'ts' }),
})

export const lezerPlugin = createHighlightPlugin({ parser })
