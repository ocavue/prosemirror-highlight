import { Decoration } from 'prosemirror-view'

export type DecorationBuilder = (options: {
  content: string
  language?: string | null
  pos: number
}) => Decoration[]
