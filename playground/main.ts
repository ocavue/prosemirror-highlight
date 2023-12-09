import 'highlight.js/styles/default.css'

import { exampleSetup } from 'prosemirror-example-setup'
import { DOMParser, Schema } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { one } from '../dist'

import { shikiPlugin } from './shiki'

console.log('one', one)

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: schema.spec.nodes.update('code_block', {
    content: 'text*',
    group: 'block',
    code: true,
    defining: true,
    marks: '',
    attrs: {
      params: { default: '' },
      detectedHighlightLanguage: { default: '' },
    },
    parseDOM: [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
        getAttrs: (node: HTMLElement | string) => ({
          params: (node as Element)?.getAttribute('data-params') || '',
        }),
      },
    ],
    toDOM(node) {
      return [
        'pre',
        { 'data-params': node.attrs.params as string },
        ['code', 0],
      ]
    },
  }),
  marks: schema.spec.marks,
})

const view = new EditorView(document.querySelector('#editor'), {
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(
      document.querySelector('#content')!,
    ),
    plugins: [...exampleSetup({ schema: mySchema }), shikiPlugin],
  }),
})

// @ts-expect-error set global variable for debugging
window._view = view
