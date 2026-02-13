import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { describe, expect, it } from 'vitest'

import { schema } from '../playground/schema'
import { shikiLazyPlugin } from '../playground/shiki-lazy'

import { formatHtml, setupNodes } from './helpers'

describe('shikiLazyPlugin', () => {
  it('can highlight javascript code block', async () => {
    const nodes = setupNodes(schema)
    const doc = nodes.doc([
      nodes.codeBlock('javascript', '1+2'),
    ])
    const state = EditorState.create({ doc, plugins: [shikiLazyPlugin] })
    const view = new EditorView(document.createElement('div'), { state })

    // Wait for the shiki to load and apply the decorations
    await expect.poll(() => view.dom.outerHTML).toContain('shiki')

    const html = await formatHtml(view.dom.outerHTML)

    expect(html).toMatchInlineSnapshot(`
      "<div contenteditable="true" translate="no" class="ProseMirror">
        <pre
          data-language="javascript"
          style="--prosemirror-highlight: #adbac7; --shiki-light: #24292e; --shiki-dark: #e1e4e8; --prosemirror-highlight-bg: #22272e; --shiki-light-bg: #fff; --shiki-dark-bg: #24292e;"
        >
          <code>
            <span
              class="shiki"
              style="color: rgb(108, 182, 255); --shiki-light: #005CC5; --shiki-dark: #79B8FF;"
            >
              1
            </span>
            <span
              class="shiki"
              style="color: rgb(244, 112, 103); --shiki-light: #D73A49; --shiki-dark: #F97583;"
            >
              +
            </span>
            <span
              class="shiki"
              style="color: rgb(108, 182, 255); --shiki-light: #005CC5; --shiki-dark: #79B8FF;"
            >
              2
            </span>
          </code>
        </pre>
      </div>;
      "
    `)
  })

  it.skip('can highlight plaintext code block', async () => {
    const nodes = setupNodes(schema)
    const doc = nodes.doc([
      nodes.codeBlock('plaintext', '1+2'),
    ])
    const state = EditorState.create({ doc, plugins: [shikiLazyPlugin] })
    const view = new EditorView(document.createElement('div'), { state })

    // Wait for the shiki to load and apply the decorations
    await expect.poll(() => view.dom.outerHTML).toContain('shiki')

    const html = await formatHtml(view.dom.outerHTML)

    expect(html).toMatchInlineSnapshot()
  })
})
