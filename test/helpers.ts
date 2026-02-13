import type { Node as ProseMirrorNode, Schema } from 'prosemirror-model'

export function setupNodes(schema: Schema) {
  const doc = (nodes: ProseMirrorNode[]) => {
    return schema.nodes.doc.createChecked({}, nodes)
  }
  const codeBlock = (language: string, text: string) => {
    return schema.nodes.code_block.createChecked(
      { language },
      text ? schema.text(text) : null,
    )
  }

  return { doc, codeBlock }
}
