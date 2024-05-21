import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { describe, expect, it } from 'vitest'

import { schema } from '../playground/schema'
import { createHighlightPlugin } from '../src/plugin'

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
    expect(html).toMatchInlineSnapshot(
      `
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
    `,
    )
  })

  it('can highlight code blocks with refractor', async () => {
    const { createParser } = await import('../src/refractor')
    const { refractor } = await import('refractor')

    const parser = createParser(refractor)
    const plugin = createHighlightPlugin({ parser })

    const state = EditorState.create({ doc, plugins: [plugin] })
    const view = new EditorView(document.createElement('div'), { state })

    const html = await formatHtml(view.dom.outerHTML)
    expect(html).toMatchInlineSnapshot(
      `
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
    `,
    )
  })

  it('can highlight code blocks with shikiji', async () => {
    const { createParser } = await import('../src/shikiji')
    const { getHighlighter } = await import('shikiji')

    const highlighter = await getHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript', 'typescript', 'python'],
    })
    const parser = createParser(highlighter)
    const plugin = createHighlightPlugin({ parser })

    const state = EditorState.create({ doc, plugins: [plugin] })
    const view = new EditorView(document.createElement('div'), { state })

    const html = await formatHtml(view.dom.outerHTML)
    expect(html).toMatchInlineSnapshot(
      `
      "<div contenteditable="true" translate="no" class="ProseMirror">
        <pre data-language="typescript">
          <code>
            <span style="color: rgb(176, 125, 72);">console</span>
            <span style="color: rgb(153, 153, 153);">.</span>
            <span style="color: rgb(89, 135, 58);">log</span>
            <span style="color: rgb(153, 153, 153);">(</span>
            <span style="color: rgb(47, 121, 138);">123</span>
            <span style="color: rgb(171, 89, 89);">+</span>
            <span style="color: rgba(181, 105, 89, 0.6);">"</span>
            <span style="color: rgb(181, 105, 89);">456</span>
            <span style="color: rgba(181, 105, 89, 0.6);">"</span>
            <span style="color: rgb(153, 153, 153);">);</span>
          </code>
        </pre>
        <pre data-language="python">
          <code>
            <span style="color: rgb(153, 132, 24);">print</span>
            <span style="color: rgb(153, 153, 153);">(</span>
            <span style="color: rgba(181, 105, 89, 0.6);">"</span>
            <span style="color: rgb(181, 105, 89);">1+1</span>
            <span style="color: rgba(181, 105, 89, 0.6);">"</span>
            <span style="color: rgb(153, 153, 153);">,</span>
            <span style="color: rgba(181, 105, 89, 0.6);">"</span>
            <span style="color: rgb(181, 105, 89);">=</span>
            <span style="color: rgba(181, 105, 89, 0.6);">"</span>
            <span style="color: rgb(153, 153, 153);">,</span>
            <span style="color: rgb(47, 121, 138);">2</span>
            <span style="color: rgb(153, 153, 153);">)</span>
          </code>
        </pre>
      </div>;
      "
    `,
    )
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
            <span class="sh__token--identifier" style="">
              console
            </span>
            <span class="sh__token--sign" style="">
              .
            </span>
            <span class="sh__token--property" style="">
              log
            </span>
            <span class="sh__token--sign" style="">
              (
            </span>
            <span class="sh__token--class" style="">
              123
            </span>
            <span class="sh__token--sign" style="">
              +
            </span>
            <span class="sh__token--string" style="">
              "
            </span>
            <span class="sh__token--string" style="">
              456
            </span>
            <span class="sh__token--string" style="">
              "
            </span>
            <span class="sh__token--sign" style="">
              )
            </span>
            <span class="sh__token--sign" style="">
              ;
            </span>
          </code>
        </pre>
        <pre data-language="python">
          <code>
            <span class="sh__token--identifier" style="">
              print
            </span>
            <span class="sh__token--sign" style="">
              (
            </span>
            <span class="sh__token--string" style="">
              "
            </span>
            <span class="sh__token--string" style="">
              1+1
            </span>
            <span class="sh__token--string" style="">
              "
            </span>
            <span class="sh__token--sign" style="">
              ,
            </span>
            <span class="sh__token--string" style="">
              "
            </span>
            <span class="sh__token--string" style="">
              =
            </span>
            <span class="sh__token--string" style="">
              "
            </span>
            <span class="sh__token--sign" style="">
              ,
            </span>
            <span class="sh__token--class" style="">
              2
            </span>
            <span class="sh__token--sign" style="">
              )
            </span>
          </code>
        </pre>
      </div>;
      "
    `,
    )
  })
})
