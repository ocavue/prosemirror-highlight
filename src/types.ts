import type { Node as ProseMirrorNode } from 'prosemirror-model'
import type { Decoration } from 'prosemirror-view'

/**
 * A function that parses the text content of a code block node and returns an
 * array of ProseMirror decorations. If the underlying syntax highlighter is
 * still loading, you can return a promise that will be resolved when the
 * highlighter is ready.
 */
export type Parser = (options: {
  /**
   * The text content of the code block node.
   */
  content: string

  /**
   * The start position of the code block node.
   */
  pos: number

  /**
   * The language of the code block node.
   */
  language?: string
}) => Decoration[] | Promise<void>

/**
 * A function that extracts the language of a code block node.
 */
export type LanguageExtractor = (node: ProseMirrorNode) => string | undefined
