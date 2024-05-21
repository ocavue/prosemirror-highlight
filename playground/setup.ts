import { exampleSetup } from 'prosemirror-example-setup'
import { DOMParser } from 'prosemirror-model'
import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { schema } from './schema'

export async function setupView({
  mount,
  plugin,
  title,
  code,
}: {
  mount: HTMLElement
  plugin: () => Promise<Plugin>
  title: string
  code: string
}) {
  const div = document.createElement('div')
  div.innerHTML = `<h2>With ${title}</h2><pre data-language="typescript"><code>${code.trim()}</code></pre>`

  return new EditorView(mount, {
    state: EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(div),
      plugins: [...exampleSetup({ schema, menuBar: false }), await plugin()],
    }),
  })
}
