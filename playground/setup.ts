import { exampleSetup } from 'prosemirror-example-setup'
import { DOMParser, Schema } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

const mySchema = new Schema({
  nodes: schema.spec.nodes.update('code_block', {
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
  marks: schema.spec.marks,
})

export function setupView({
  mount,
  plugin,
  title,
  code,
}: {
  mount: HTMLElement
  plugin: Plugin
  title: string
  code: string
}) {
  const div = document.createElement('div')
  div.innerHTML = `<h1>${title}</h1><pre data-language="typescript"><code>${code}</code></pre>`

  new EditorView(mount, {
    state: EditorState.create({
      doc: DOMParser.fromSchema(mySchema).parse(div),
      plugins: [...exampleSetup({ schema: mySchema, menuBar: false }), plugin],
    }),
  })
}
