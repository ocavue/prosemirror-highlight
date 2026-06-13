import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { schema } from '../playground/schema'
import { createHighlightPlugin } from '../src/plugin'
import type { Parser } from '../src/types'

import { setupNodes } from './helpers'

describe('createHighlightPlugin', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not refresh after the view is destroyed', async () => {
    const errors: unknown[] = []
    vi.spyOn(console, 'error').mockImplementation((...args) => {
      errors.push(...args)
    })

    let resolveParse: () => void = () => {}
    const parsing = new Promise<void>((resolve) => {
      resolveParse = resolve
    })
    const parser: Parser = () => parsing

    const nodes = setupNodes(schema)
    const doc = nodes.doc([nodes.codeBlock('javascript', '1 + 1')])
    const state = EditorState.create({
      doc,
      plugins: [createHighlightPlugin({ parser })],
    })
    const view = new EditorView(document.createElement('div'), { state })
    const dispatch = vi.spyOn(view, 'dispatch')

    // The parser resolves only after the view is gone, which is what happens
    // when an async grammar finishes loading post-unmount.
    view.destroy()
    resolveParse()
    await new Promise<void>((resolve) => setTimeout(resolve, 0))

    expect(view.isDestroyed).toBe(true)
    expect(dispatch).not.toHaveBeenCalled()
    expect(errors).toEqual([])
  })
})
