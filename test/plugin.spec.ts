import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { describe, expect, it } from 'vitest'

import { schema } from '../playground/schema'
import { createHighlightPlugin } from '../src/plugin'
import type { ParserOptions } from '../src/types'

import { formatHtml, setupNodes } from './helpers'

describe('createHighlightPlugin', () => {
  const nodes = setupNodes(schema)

  const doc = nodes.doc([
    nodes.codeBlock('typescript', 'console.log(123+"456");'),
    nodes.codeBlock('python', 'print("1+1","=",2)'),
  ])

  it('can highlight code blocks with lowlight', async () => {
    const { createParser } = await import('../src/lowlight')
    const { common, createLowlight } = await import('lowlight')

    const lowlight = createLowlight(common)
    const parser = createParser(lowlight)
    const plugin = createHighlightPlugin({ parser })

    const state = EditorState.create({ doc, plugins: [plugin] })
    const view = new EditorView(document.createElement('div'), { state })

    const html = await formatHtml(view.dom.outerHTML)
    expect(html).toMatchInlineSnapshot(`
      "<div contenteditable="true" translate="no" class="ProseMirror">
        <pre data-language="typescript">
          <code>
            <span class="hljs-variable language_">console</span>.
            <span class="hljs-title function_">log</span>(
            <span class="hljs-number">123</span>+
            <span class="hljs-string">"456"</span>);
          </code>
        </pre>
        <pre data-language="python">
          <code>
            <span class="hljs-built_in">print</span>(
            <span class="hljs-string">"1+1"</span>,
            <span class="hljs-string">"="</span>,<span class="hljs-number">2</span>)
          </code>
        </pre>
      </div>;
      "
    `)
  })

  it('can highlight code blocks with refractor', async () => {
    const { createParser } = await import('../src/refractor')
    const { refractor } = await import('refractor/all')

    const parser = createParser(refractor)
    const plugin = createHighlightPlugin({ parser })

    const state = EditorState.create({ doc, plugins: [plugin] })
    const view = new EditorView(document.createElement('div'), { state })

    const html = await formatHtml(view.dom.outerHTML)
    expect(html).toMatchInlineSnapshot(`
      "<div contenteditable="true" translate="no" class="ProseMirror">
        <pre data-language="typescript">
          <code>
            <span class="token builtin">console</span>
            <span class="token punctuation">.</span>
            <span class="token function">log</span>
            <span class="token punctuation">(</span>
            <span class="token number">123</span>
            <span class="token operator">+</span>
            <span class="token string">"456"</span>
            <span class="token punctuation">)</span>
            <span class="token punctuation">;</span>
          </code>
        </pre>
        <pre data-language="python">
          <code>
            <span class="token keyword">print</span>
            <span class="token punctuation">(</span>
            <span class="token string">"1+1"</span>
            <span class="token punctuation">,</span>
            <span class="token string">"="</span>
            <span class="token punctuation">,</span>
            <span class="token number">2</span>
            <span class="token punctuation">)</span>
          </code>
        </pre>
      </div>;
      "
    `)
  })

  it('can highlight code blocks with sugar-high', async () => {
    const { createParser } = await import('../src/sugar-high')

    const parser = createParser()
    const plugin = createHighlightPlugin({ parser })

    const state = EditorState.create({ doc, plugins: [plugin] })
    const view = new EditorView(document.createElement('div'), { state })

    const html = await formatHtml(view.dom.outerHTML)
    expect(html).toMatchInlineSnapshot(
      `
      "<div contenteditable="true" translate="no" class="ProseMirror">
        <pre data-language="typescript">
          <code>
            <span class="sh__token--identifier" style="color: var(--sh-identifier);">
              console
            </span>
            <span class="sh__token--sign" style="color: var(--sh-sign);">
              .
            </span>
            <span class="sh__token--property" style="color: var(--sh-property);">
              log
            </span>
            <span class="sh__token--sign" style="color: var(--sh-sign);">
              (
            </span>
            <span class="sh__token--class" style="color: var(--sh-class);">
              123
            </span>
            <span class="sh__token--sign" style="color: var(--sh-sign);">
              +
            </span>
            <span class="sh__token--string" style="color: var(--sh-string);">
              "
            </span>
            <span class="sh__token--string" style="color: var(--sh-string);">
              456
            </span>
            <span class="sh__token--string" style="color: var(--sh-string);">
              "
            </span>
            <span class="sh__token--sign" style="color: var(--sh-sign);">
              )
            </span>
            <span class="sh__token--sign" style="color: var(--sh-sign);">
              ;
            </span>
          </code>
        </pre>
        <pre data-language="python">
          <code>
            <span class="sh__token--identifier" style="color: var(--sh-identifier);">
              print
            </span>
            <span class="sh__token--sign" style="color: var(--sh-sign);">
              (
            </span>
            <span class="sh__token--string" style="color: var(--sh-string);">
              "
            </span>
            <span class="sh__token--string" style="color: var(--sh-string);">
              1+1
            </span>
            <span class="sh__token--string" style="color: var(--sh-string);">
              "
            </span>
            <span class="sh__token--sign" style="color: var(--sh-sign);">
              ,
            </span>
            <span class="sh__token--string" style="color: var(--sh-string);">
              "
            </span>
            <span class="sh__token--string" style="color: var(--sh-string);">
              =
            </span>
            <span class="sh__token--string" style="color: var(--sh-string);">
              "
            </span>
            <span class="sh__token--sign" style="color: var(--sh-sign);">
              ,
            </span>
            <span class="sh__token--class" style="color: var(--sh-class);">
              2
            </span>
            <span class="sh__token--sign" style="color: var(--sh-sign);">
              )
            </span>
          </code>
        </pre>
      </div>;
      "
    `,
    )
  })

  it('can highlight code blocks with lezer', async () => {
    const { createParser } = await import('../src/lezer')
    const { classHighlighter } = await import('@lezer/highlight')
    const { parser: javascriptParser } = await import('@lezer/javascript')
    const { parser: cssParser } = await import('@lezer/css')

    const parse = (options: ParserOptions) => {
      const lang = options.language?.toLowerCase() || ''
      if (
        ['js', 'javascript', 'ts', 'typescript', 'jsx', 'tsx'].includes(lang)
      ) {
        return javascriptParser.parse(options.content)
      }
      if (['css'].includes(lang)) {
        return cssParser.parse(options.content)
      }
    }

    const parser = createParser({ parse, highlighter: classHighlighter })
    const plugin = createHighlightPlugin({ parser })

    const state = EditorState.create({ doc, plugins: [plugin] })
    const view = new EditorView(document.createElement('div'), { state })

    const html = await formatHtml(view.dom.outerHTML)
    expect(html).toMatchInlineSnapshot(`
      "<div contenteditable="true" translate="no" class="ProseMirror">
        <pre data-language="typescript">
          <code>
            <span class="tok-variableName">console</span>
            <span class="tok-operator">.</span>
            <span class="tok-propertyName">log</span>
            <span class="tok-punctuation">(</span>
            <span class="tok-number">123</span>
            <span class="tok-operator">+</span>
            <span class="tok-string">"456"</span>
            <span class="tok-punctuation">)</span>
            <span class="tok-punctuation">;</span>
          </code>
        </pre>
        <pre data-language="python">
          <code>print("1+1","=",2)</code>
        </pre>
      </div>;
      "
    `)
  })

  it('can highlight code blocks with shiki', async () => {
    const { createParser } = await import('../src/shiki')
    const { createHighlighter } = await import('shiki')

    const highlighter = await createHighlighter({
      themes: ['github-dark'],
      langs: ['typescript', 'python'],
    })

    const parser = createParser(highlighter, {
      theme: 'github-dark',
      defaultColor: false,
    })
    const plugin = createHighlightPlugin({ parser })

    const state = EditorState.create({ doc, plugins: [plugin] })
    const view = new EditorView(document.createElement('div'), { state })

    const html = await formatHtml(view.dom.outerHTML)
    expect(html).toMatchInlineSnapshot(`
      "<div contenteditable="true" translate="no" class="ProseMirror">
        <pre
          data-language="typescript"
          style="--prosemirror-highlight: #e1e4e8; --prosemirror-highlight-bg: #24292e;"
        >
          <code>
            <span class="shiki" style="color: rgb(225, 228, 232);">
              console.
            </span>
            <span class="shiki" style="color: rgb(179, 146, 240);">
              log
            </span>
            <span class="shiki" style="color: rgb(225, 228, 232);">
              (
            </span>
            <span class="shiki" style="color: rgb(121, 184, 255);">
              123
            </span>
            <span class="shiki" style="color: rgb(249, 117, 131);">
              +
            </span>
            <span class="shiki" style="color: rgb(158, 203, 255);">
              "456"
            </span>
            <span class="shiki" style="color: rgb(225, 228, 232);">
              );
            </span>
          </code>
        </pre>
        <pre
          data-language="python"
          style="--prosemirror-highlight: #e1e4e8; --prosemirror-highlight-bg: #24292e;"
        >
          <code>
            <span class="shiki" style="color: rgb(121, 184, 255);">
              print
            </span>
            <span class="shiki" style="color: rgb(225, 228, 232);">
              (
            </span>
            <span class="shiki" style="color: rgb(158, 203, 255);">
              "1+1"
            </span>
            <span class="shiki" style="color: rgb(225, 228, 232);">
              ,
            </span>
            <span class="shiki" style="color: rgb(158, 203, 255);">
              "="
            </span>
            <span class="shiki" style="color: rgb(225, 228, 232);">
              ,
            </span>
            <span class="shiki" style="color: rgb(121, 184, 255);">
              2
            </span>
            <span class="shiki" style="color: rgb(225, 228, 232);">
              )
            </span>
          </code>
        </pre>
      </div>;
      "
    `)
  })

  it('can highlight code blocks with shiki and multiple themes', async () => {
    const { createParser } = await import('../src/shiki')
    const { createHighlighter } = await import('shiki')

    const highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark', 'github-dark-dimmed'],
      langs: ['typescript', 'python'],
    })

    const parser = createParser(highlighter, {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
        dim: 'github-dark-dimmed',
      },
      defaultColor: false,
      cssVariablePrefix: '--custom-prefix-',
    })
    const plugin = createHighlightPlugin({ parser })

    const state = EditorState.create({ doc, plugins: [plugin] })
    const view = new EditorView(document.createElement('div'), { state })

    const html = await formatHtml(view.dom.outerHTML)
    expect(html).toMatchInlineSnapshot(`
      "<div contenteditable="true" translate="no" class="ProseMirror">
        <pre
          data-language="typescript"
          style="--custom-prefix-light: #24292e; --custom-prefix-dark: #e1e4e8; --custom-prefix-dim: #adbac7; --custom-prefix-light-bg: #fff; --custom-prefix-dark-bg: #24292e; --custom-prefix-dim-bg: #22272e;"
        >
          <code>
            <span
              class="shiki"
              style="--custom-prefix-light: #24292E; --custom-prefix-dark: #E1E4E8; --custom-prefix-dim: #ADBAC7;"
            >
              console.
            </span>
            <span
              class="shiki"
              style="--custom-prefix-light: #6F42C1; --custom-prefix-dark: #B392F0; --custom-prefix-dim: #DCBDFB;"
            >
              log
            </span>
            <span
              class="shiki"
              style="--custom-prefix-light: #24292E; --custom-prefix-dark: #E1E4E8; --custom-prefix-dim: #ADBAC7;"
            >
              (
            </span>
            <span
              class="shiki"
              style="--custom-prefix-light: #005CC5; --custom-prefix-dark: #79B8FF; --custom-prefix-dim: #6CB6FF;"
            >
              123
            </span>
            <span
              class="shiki"
              style="--custom-prefix-light: #D73A49; --custom-prefix-dark: #F97583; --custom-prefix-dim: #F47067;"
            >
              +
            </span>
            <span
              class="shiki"
              style="--custom-prefix-light: #032F62; --custom-prefix-dark: #9ECBFF; --custom-prefix-dim: #96D0FF;"
            >
              "456"
            </span>
            <span
              class="shiki"
              style="--custom-prefix-light: #24292E; --custom-prefix-dark: #E1E4E8; --custom-prefix-dim: #ADBAC7;"
            >
              );
            </span>
          </code>
        </pre>
        <pre
          data-language="python"
          style="--custom-prefix-light: #24292e; --custom-prefix-dark: #e1e4e8; --custom-prefix-dim: #adbac7; --custom-prefix-light-bg: #fff; --custom-prefix-dark-bg: #24292e; --custom-prefix-dim-bg: #22272e;"
        >
          <code>
            <span
              class="shiki"
              style="--custom-prefix-light: #005CC5; --custom-prefix-dark: #79B8FF; --custom-prefix-dim: #6CB6FF;"
            >
              print
            </span>
            <span
              class="shiki"
              style="--custom-prefix-light: #24292E; --custom-prefix-dark: #E1E4E8; --custom-prefix-dim: #ADBAC7;"
            >
              (
            </span>
            <span
              class="shiki"
              style="--custom-prefix-light: #032F62; --custom-prefix-dark: #9ECBFF; --custom-prefix-dim: #96D0FF;"
            >
              "1+1"
            </span>
            <span
              class="shiki"
              style="--custom-prefix-light: #24292E; --custom-prefix-dark: #E1E4E8; --custom-prefix-dim: #ADBAC7;"
            >
              ,
            </span>
            <span
              class="shiki"
              style="--custom-prefix-light: #032F62; --custom-prefix-dark: #9ECBFF; --custom-prefix-dim: #96D0FF;"
            >
              "="
            </span>
            <span
              class="shiki"
              style="--custom-prefix-light: #24292E; --custom-prefix-dark: #E1E4E8; --custom-prefix-dim: #ADBAC7;"
            >
              ,
            </span>
            <span
              class="shiki"
              style="--custom-prefix-light: #005CC5; --custom-prefix-dark: #79B8FF; --custom-prefix-dim: #6CB6FF;"
            >
              2
            </span>
            <span
              class="shiki"
              style="--custom-prefix-light: #24292E; --custom-prefix-dark: #E1E4E8; --custom-prefix-dim: #ADBAC7;"
            >
              )
            </span>
          </code>
        </pre>
      </div>;
      "
    `)
  })
})
