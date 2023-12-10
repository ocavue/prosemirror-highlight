import { Node as ProseMirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import { DecorationSet } from 'prosemirror-view'

import { DecorationCache } from './cache'
import type { LanguageExtractor, Parser } from './types'

/** Describes the current state of the highlightPlugin  */
export interface HighlightPluginState {
  cache: DecorationCache
  decorations: DecorationSet
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
  const extractor =
    languageExtractor ||
    function (node: ProseMirrorNode) {
      const detectedLanguage = node.attrs.detectedHighlightLanguage as string
      const params = node.attrs.params as string
      return detectedLanguage || params?.split(' ')[0] || ''
    }

  const getDecos = (doc: ProseMirrorNode, cache: DecorationCache) => {
    doc.descendants((node, pos) => {
      if (!nodeTypes.includes(node.type.name)) {
        return
      }

      const language = extractor(node)

      const decorations = parser({
        content: node.textContent,
        language: language || undefined,
        pos,
      })

      cache.set(pos, node, decorations)
    })
  }

  // key the plugin so we can easily find it in the state later
  const key = new PluginKey<HighlightPluginState>()

  return new Plugin<HighlightPluginState>({
    key,
    state: {
      init(_, instance) {
        const cache = new DecorationCache({})

        getDecos(instance.doc, cache)

        return {
          cache: cache,
          decorations: DecorationSet.create(instance.doc, cache.build()),
        }
      },
      apply(tr, data) {
        const cache = data.cache.invalidate(tr)
        if (!tr.docChanged) {
          return {
            cache: cache,
            decorations: data.decorations.map(tr.mapping, tr.doc),
          }
        }

        getDecos(tr.doc, cache)

        return {
          cache: cache,
          decorations: DecorationSet.create(tr.doc, cache.build()),
        }
      },
    },
    props: {
      decorations(this: Plugin<HighlightPluginState>, state) {
        return this.getState(state)?.decorations
      },
    },
  })
}
