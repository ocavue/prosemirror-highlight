import { Node as ProseMirrorNode } from 'prosemirror-model'
import { Decoration } from 'prosemirror-view'

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

export type LanguageExtractor = (node: ProseMirrorNode) => string | undefined
