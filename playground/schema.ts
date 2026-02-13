import { Schema } from 'prosemirror-model'
import { schema as basicSchema } from 'prosemirror-schema-basic'

export const schema: Schema = new Schema({
  nodes: basicSchema.spec.nodes.update('code_block', {
    content: 'text*',
    group: 'block',
    code: true,
    defining: true,
    marks: '',
    attrs: {
      language: { default: '' },
    },
    parseDOM: [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
        getAttrs: (node) => ({
          language: (node as Element)?.getAttribute('data-language') || '',
        }),
      },
    ],
    toDOM(node) {
      return [
        'pre',
        { 'data-language': node.attrs.language as string },
        ['code', 0],
      ]
    },
  }),
  marks: basicSchema.spec.marks,
})
