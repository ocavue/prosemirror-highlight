import { Node as ProseMirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

import { DecorationCache } from './cache'
import type { LanguageExtractor, Parser } from './types'

/**
 * Describes the current state of the highlightPlugin
 */
export interface HighlightPluginState {
  cache: DecorationCache
  decorations: DecorationSet
  promises: Promise<void>[]
}

/**
 * Creates a plugin that highlights the contents of all nodes (via Decorations)
 * with a type passed in blockTypes
 */
export function createHighlightPlugin({
  parser,
  nodeTypes = ['code_block'],
  languageExtractor = (node) => node.attrs.language as string | undefined,
}: {
  /**
   * A function that returns an array of decorations for the given node text
   * content, language, and position.
   */
  parser: Parser

  /**
   * An array containing all the node type name to target for highlighting.
   *
   * @default ['code_block']
   */
  nodeTypes?: string[]

  /**
   * A function that returns the language string to use when highlighting that
   * node. By default, it returns `node.attrs.language`.
   */
  languageExtractor?: LanguageExtractor
}): Plugin<HighlightPluginState> {
  const key = new PluginKey<HighlightPluginState>()

  return new Plugin<HighlightPluginState>({
    key,
    state: {
      init(_, instance) {
        const cache = new DecorationCache()
        const [decorations, promises] = calculateDecoration(
          instance.doc,
          parser,
          nodeTypes,
          languageExtractor,
          cache,
        )

        return { cache, decorations, promises }
      },
      apply: (tr, data) => {
        const cache = data.cache.invalidate(tr)
        const refresh = !!tr.getMeta('prosemirror-highlight-refresh')

        if (!tr.docChanged && !refresh) {
          const decorations = data.decorations.map(tr.mapping, tr.doc)
          const promises = data.promises
          return { cache, decorations, promises }
        }

        const [decorations, promises] = calculateDecoration(
          tr.doc,
          parser,
          nodeTypes,
          languageExtractor,
          cache,
        )
        return { cache, decorations, promises }
      },
    },
    view: (view) => {
      const promises = new Set<Promise<void>>()

      // Refresh the decorations when all promises resolve
      const refresh = () => {
        if (promises.size > 0) {
          return
        }
        const tr = view.state.tr.setMeta('prosemirror-highlight-refresh', true)
        view.dispatch(tr)
      }

      const check = () => {
        const state = key.getState(view.state)

        for (const promise of state?.promises ?? []) {
          promises.add(promise)
          promise
            .then(() => {
              promises.delete(promise)
              refresh()
            })
            .catch(() => {
              promises.delete(promise)
            })
        }
      }

      check()

      return {
        update: () => {
          check()
        },
      }
    },
    props: {
      decorations(this, state) {
        return this.getState(state)?.decorations
      },
    },
  })
}

function calculateDecoration(
  doc: ProseMirrorNode,
  parser: Parser,
  nodeTypes: string[],
  languageExtractor: LanguageExtractor,
  cache: DecorationCache,
) {
  const result: Decoration[] = []
  const promises: Promise<void>[] = []

  doc.descendants((node, pos) => {
    if (!node.type.isTextblock) {
      return true
    }

    if (nodeTypes.includes(node.type.name)) {
      const language = languageExtractor(node)
      const cached = cache.get(pos)

      if (cached) {
        const [_, decorations] = cached
        result.push(...decorations)
      } else {
        const decorations = parser({
          content: node.textContent,
          language: language || undefined,
          pos,
        })

        if (decorations && Array.isArray(decorations)) {
          cache.set(pos, node, decorations)
          result.push(...decorations)
        } else if (decorations instanceof Promise) {
          cache.remove(pos)
          promises.push(decorations)
        }
      }
    }
    return false
  })

  return [DecorationSet.create(doc, result), promises] as const
}
