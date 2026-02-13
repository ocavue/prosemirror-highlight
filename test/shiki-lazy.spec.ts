import { formatHTML } from 'diffable-html-snapshot'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { schema } from '../playground/schema'
import { shikiLazyPlugin } from '../playground/shiki-lazy'

import { setupNodes } from './helpers'

describe('shikiLazyPlugin', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('can highlight javascript code block', async () => {
    const nodes = setupNodes(schema)
    const doc = nodes.doc([nodes.codeBlock('javascript', '1+2')])
    const state = EditorState.create({ doc, plugins: [shikiLazyPlugin] })
    const view = new EditorView(document.createElement('div'), { state })

    // Wait for the shiki to load and apply the decorations
    await expect.poll(() => view.dom.outerHTML).toContain('shiki')

    const html = formatHTML(view.dom.outerHTML)

    expect(html).toMatchInlineSnapshot(`
      "
      <div
        class="ProseMirror"
        contenteditable="true"
        translate="no"
      >
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
      </div>
      "
    `)
  })

  it('can highlight plaintext code block', async () => {
    const nodes = setupNodes(schema)
    const doc = nodes.doc([nodes.codeBlock('plaintext', '1+2')])
    const state = EditorState.create({ doc, plugins: [shikiLazyPlugin] })
    const view = new EditorView(document.createElement('div'), { state })

    // Wait for the shiki to load and apply the decorations
    await expect.poll(() => view.dom.outerHTML).toContain('shiki')

    const html = formatHTML(view.dom.outerHTML)

    expect(html).toMatchInlineSnapshot(`
      "
      <div
        class="ProseMirror"
        contenteditable="true"
        translate="no"
      >
        <pre
          data-language="plaintext"
          style="--prosemirror-highlight: #adbac7; --shiki-light: #24292e; --shiki-dark: #e1e4e8; --prosemirror-highlight-bg: #22272e; --shiki-light-bg: #fff; --shiki-dark-bg: #24292e;"
        >
          <code>
            <span class="shiki">
              1+2
            </span>
          </code>
        </pre>
      </div>
      "
    `)
  })

  it('can print errors', async () => {
    const calledArgs: unknown[] = []
    vi.spyOn(console, 'error').mockImplementation((...args) => {
      calledArgs.push(...args)
    })

    const expectCalledWith = (message: string) => {
      return expect
        .poll(() => calledArgs)
        .toContainEqual(expect.stringContaining(message))
    }

    const nodes = setupNodes(schema)
    const doc = nodes.doc([nodes.codeBlock('javascript', '3+3')])
    const state = EditorState.create({ doc, plugins: [shikiLazyPlugin] })
    const view = new EditorView(document.createElement('div'), { state })
    await expect.poll(() => view.dom.outerHTML).toContain('shiki')

    view.dispatch(
      view.state.tr.insert(0, nodes.codeBlock('unknown-language', '2+2')),
    )
    await expectCalledWith('[prosemirror-highlight] Error resolving parser')
    view.dispatch(view.state.tr.insert(0, nodes.codeBlock('javascript', '1+1')))
    await expect.poll(() => view.dom.outerHTML).toContain('shiki')
    await expectCalledWith('[prosemirror-highlight] Error parsing code blocks')

    const html = formatHTML(view.dom.outerHTML)

    expect(html).toMatchInlineSnapshot(`
      "
      <div
        class="ProseMirror"
        contenteditable="true"
        translate="no"
      >
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
              1
            </span>
          </code>
        </pre>
        <pre data-language="unknown-language">
          <code>
            2+2
          </code>
        </pre>
        <pre
          data-language="javascript"
          style
        >
          <code>
            3+3
          </code>
        </pre>
      </div>
      "
    `)
  })
})
