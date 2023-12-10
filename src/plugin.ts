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
  // key the plugin so we can easily find it in the state later
  const key = new PluginKey<HighlightPluginState>()

  return new Plugin<HighlightPluginState>({
    key,
    state: {
      init(_, instance) {
        const cache = new DecorationCache()
        const decorations = getDecorationSet(
          instance.doc,
          parser,
          nodeTypes,
          languageExtractor,
          cache,
        )
        return { cache, decorations }
      },
      apply(tr, data) {
        const cache = data.cache.invalidate(tr)

        if (!tr.docChanged) {
          const decorations = data.decorations.map(tr.mapping, tr.doc)
          return { cache, decorations }
        }

        const decorations = getDecorationSet(
          tr.doc,
          parser,
          nodeTypes,
          languageExtractor,
          cache,
        )
        return { cache, decorations }
      },
    },
    props: {
      decorations(this, state) {
        return this.getState(state)?.decorations
      },
    },
  })
}

function getDecorationSet(
  doc: ProseMirrorNode,
  parser: Parser,
  nodeTypes: string[],
  languageExtractor: LanguageExtractor,
  cache: DecorationCache,
): DecorationSet {
  const result: Decoration[] = []

  doc.descendants((node, pos) => {
    if (!node.type.isTextblock) {
      return true
    }

    if (nodeTypes.includes(node.type.name)) {
      const language = languageExtractor(node)
      const cached = cache.get(pos)

      if (cached) {
        result.push(...cached.decorations)
      } else {
        const decorations = parser({
          content: node.textContent,
          language: language || undefined,
          pos,
        })
        cache.set(pos, node, decorations)
        result.push(...decorations)
      }
    }
    return false
  })

  return DecorationSet.create(doc, result)
}
