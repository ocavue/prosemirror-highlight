import { formatHTML } from 'diffable-html-snapshot'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { describe, expect, it } from 'vitest'

import { schema } from '../playground/schema'
import { withLineNumbers } from '../src/line-number'
import { createHighlightPlugin } from '../src/plugin'

import { setupNodes } from './helpers'

describe('withLineNumbers', () => {
  const nodes = setupNodes(schema)

  it('can add line numbers to highlighted code blocks', async () => {
    const { createParser } = await import('../src/lowlight')
    const { common, createLowlight } = await import('lowlight')

    const lowlight = createLowlight(common)
    const parser = withLineNumbers(createParser(lowlight))
    const plugin = createHighlightPlugin({ parser })

    const doc = nodes.doc([
      nodes.codeBlock('typescript', 'const a = 1\nconst b = 2'),
    ])

    const state = EditorState.create({ doc, plugins: [plugin] })
    const view = new EditorView(document.createElement('div'), { state })

    const html = formatHTML(view.dom.outerHTML)
    expect(html).toMatchInlineSnapshot(`
      "
      <div
        class="ProseMirror"
        contenteditable="true"
        translate="no"
      >
        <pre data-language="typescript">
          <code>
            <span class="line-number ProseMirror-widget">
              1
            </span>
            <span class="hljs-keyword">
              const
            </span>
            a =
            <span class="hljs-number">
              1
            </span>
            <span class="line-number ProseMirror-widget">
              2
            </span>
            <span class="hljs-keyword">
              const
            </span>
            b =
            <span class="hljs-number">
              2
            </span>
          </code>
        </pre>
      </div>
      "
    `)
  })

  it('can add line numbers to single-line code blocks', async () => {
    const { createParser } = await import('../src/sugar-high')

    const parser = withLineNumbers(createParser())
    const plugin = createHighlightPlugin({ parser })

    const doc = nodes.doc([nodes.codeBlock('typescript', 'console.log(1)')])

    const state = EditorState.create({ doc, plugins: [plugin] })
    const view = new EditorView(document.createElement('div'), { state })

    const html = formatHTML(view.dom.outerHTML)
    expect(html).toMatchInlineSnapshot(`
      "
      <div
        class="ProseMirror"
        contenteditable="true"
        translate="no"
      >
        <pre data-language="typescript">
          <code>
            <span class="line-number ProseMirror-widget">
              1
            </span>
            <span
              class="sh__token--identifier"
              style="color: var(--sh-identifier);"
            >
              console
            </span>
            <span
              class="sh__token--sign"
              style="color: var(--sh-sign);"
            >
              .
            </span>
            <span
              class="sh__token--property"
              style="color: var(--sh-property);"
            >
              log
            </span>
            <span
              class="sh__token--sign"
              style="color: var(--sh-sign);"
            >
              (
            </span>
            <span
              class="sh__token--class"
              style="color: var(--sh-class);"
            >
              1
            </span>
            <span
              class="sh__token--sign"
              style="color: var(--sh-sign);"
            >
              )
            </span>
          </code>
        </pre>
      </div>
      "
    `)
  })

  it('can add line numbers to multiple code blocks', async () => {
    const { createParser } = await import('../src/refractor')
    const { refractor } = await import('refractor/all')

    const parser = withLineNumbers(createParser(refractor))
    const plugin = createHighlightPlugin({ parser })

    const doc = nodes.doc([
      nodes.codeBlock('typescript', 'const a = 1\nconst b = 2\n'),
      nodes.codeBlock('python', 'x = 1\ny = 2\nz = 3'),
    ])

    const state = EditorState.create({ doc, plugins: [plugin] })
    const view = new EditorView(document.createElement('div'), { state })

    const html = formatHTML(view.dom.outerHTML)
    expect(html).toMatchInlineSnapshot(`
      "
      <div
        class="ProseMirror"
        contenteditable="true"
        translate="no"
      >
        <pre data-language="typescript">
          <code>
            <span class="line-number ProseMirror-widget">
              1
            </span>
            <span class="token keyword">
              const
            </span>
            a
            <span class="token operator">
              =
            </span>
            <span class="token number">
              1
            </span>
            <span class="line-number ProseMirror-widget">
              2
            </span>
            <span class="token keyword">
              const
            </span>
            b
            <span class="token operator">
              =
            </span>
            <span class="token number">
              2
            </span>
            <span class="line-number ProseMirror-widget">
              3
            </span>
            <img
              alt
              class="ProseMirror-separator"
            >
            <br class="ProseMirror-trailingBreak">
          </code>
        </pre>
        <pre data-language="python">
          <code>
            <span class="line-number ProseMirror-widget">
              1
            </span>
            x
            <span class="token operator">
              =
            </span>
            <span class="token number">
              1
            </span>
            <span class="line-number ProseMirror-widget">
              2
            </span>
            y
            <span class="token operator">
              =
            </span>
            <span class="token number">
              2
            </span>
            <span class="line-number ProseMirror-widget">
              3
            </span>
            z
            <span class="token operator">
              =
            </span>
            <span class="token number">
              3
            </span>
          </code>
        </pre>
      </div>
      "
    `)
  })

  it('works with empty code blocks', async () => {
    const { createParser } = await import('../src/shiki')
    const { createHighlighter } = await import('shiki')

    const highlighter = await createHighlighter({
      themes: ['github-dark'],
      langs: ['typescript'],
    })

    const parser = withLineNumbers(
      createParser(highlighter, { theme: 'github-dark', defaultColor: false }),
    )
    const plugin = createHighlightPlugin({ parser })

    const doc = nodes.doc([nodes.codeBlock('typescript', ''), nodes.codeBlock('typescript', '\n'), nodes.codeBlock('typescript', '\n\n')])

    const state = EditorState.create({ doc, plugins: [plugin] })
    const view = new EditorView(document.createElement('div'), { state })

    const html = formatHTML(view.dom.outerHTML)
    expect(html).toMatchInlineSnapshot(`
      "
      <div
        class="ProseMirror"
        contenteditable="true"
        translate="no"
      >
        <pre
          data-language="typescript"
          style="--prosemirror-highlight: #e1e4e8; --prosemirror-highlight-bg: #24292e;"
        >
          <code>
            <span class="line-number ProseMirror-widget">
              1
            </span>
            <img
              alt
              class="ProseMirror-separator"
            >
            <br class="ProseMirror-trailingBreak">
          </code>
        </pre>
        <pre
          data-language="typescript"
          style="--prosemirror-highlight: #e1e4e8; --prosemirror-highlight-bg: #24292e;"
        >
          <code>
            <span class="line-number ProseMirror-widget">
              1
            </span>
            <span class="line-number ProseMirror-widget">
              2
            </span>
            <img
              alt
              class="ProseMirror-separator"
            >
            <br class="ProseMirror-trailingBreak">
          </code>
        </pre>
        <pre
          data-language="typescript"
          style="--prosemirror-highlight: #e1e4e8; --prosemirror-highlight-bg: #24292e;"
        >
          <code>
            <span class="line-number ProseMirror-widget">
              1
            </span>
            <span class="line-number ProseMirror-widget">
              2
            </span>
            <span class="line-number ProseMirror-widget">
              3
            </span>
            <img
              alt
              class="ProseMirror-separator"
            >
            <br class="ProseMirror-trailingBreak">
          </code>
        </pre>
      </div>
      "
    `)
  })
})
