import { Node as ProseMirrorNode } from 'prosemirror-model'
import { Decoration } from 'prosemirror-view'

export type DecorationBuilder = (options: {
  content: string
  language?: string | null
  pos: number
}) => Decoration[]

export type LanguageExtractor = (node: ProseMirrorNode) => string
