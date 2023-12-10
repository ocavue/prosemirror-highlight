import { exampleSetup } from 'prosemirror-example-setup'
import { DOMParser } from 'prosemirror-model'
import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { schema } from './schema'

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

  return new EditorView(mount, {
    state: EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(div),
      plugins: [...exampleSetup({ schema, menuBar: false }), plugin],
    }),
  })
}
