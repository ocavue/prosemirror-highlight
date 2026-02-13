import { schema } from 'prosemirror-schema-basic'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { describe, expect, it } from 'vitest'

import { shikiLazyPlugin } from '../playground/shiki-lazy'

import { formatHtml, setupNodes } from './helpers'

describe('shikiLazyPlugin', () => {
  it('can highlight code blocks with shiki lazy parser', async () => {
    const nodes = setupNodes(schema)

    const doc = nodes.doc([
      nodes.codeBlock('plaintext', 'console.log(123+"456");'),
    ])

    const state = EditorState.create({ doc, plugins: [shikiLazyPlugin] })
    const view = new EditorView(document.createElement('div'), { state })

    await expect.poll(() => view.dom.outerHTML).toContain('shiki')

    const html = await formatHtml(view.dom.outerHTML)

    expect(html).toMatchInlineSnapshot(`
      "<div contenteditable="true" translate="no" class="ProseMirror">
        <pre style="--prosemirror-highlight: #adbac7; --shiki-light: #24292e; --shiki-dark: #e1e4e8; --prosemirror-highlight-bg: #22272e; --shiki-light-bg: #fff; --shiki-dark-bg: #24292e;">
          <code>
            <span class="shiki">console.log(123+"456");</span>
          </code>
        </pre>
      </div>;
      "
    `)
  })
})
