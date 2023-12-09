import { exampleSetup } from 'prosemirror-example-setup'
import { DOMParser, Schema } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { one } from '../src'

console.log('one', one)

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks,
})

const view = new EditorView(document.querySelector('#editor'), {
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(
      document.querySelector('#content')!,
    ),
    plugins: exampleSetup({ schema: mySchema }),
  }),
})

// @ts-expect-error set global variable for debugging
window._view = view
