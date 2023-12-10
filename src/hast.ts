import type { Element, ElementContent, Root, RootContent } from 'hast'
import { Decoration } from 'prosemirror-view'

export function fillFromRoot(
  decorations: Decoration[],
  node: Root,
  from: number,
) {
  for (const child of node.children) {
    from = fillFromRootContent(decorations, child, from)
  }
}

function fillFromRootContent(
  decorations: Decoration[],
  node: RootContent,
  from: number,
): number {
  if (node.type === 'element') {
    const to = from + getElementSize(node)
    const { className, ...rest } = node.properties || {}
    decorations.push(
      Decoration.inline(from, to, {
        class: className
          ? Array.isArray(className)
            ? className.join(' ')
            : String(className)
          : undefined,
        ...rest,
        nodeName: node.tagName,
      }),
    )
    return to
  } else if (node.type === 'text') {
    return from + node.value.length
  } else {
    return from
  }
}

function getElementSize(node: Element): number {
  let size = 0

  for (const child of node.children) {
    size += getElementContentSize(child)
  }

  return size
}

function getElementContentSize(node: ElementContent): number {
  switch (node.type) {
    case 'element':
      return getElementSize(node)
    case 'text':
      return node.value.length
    default:
      return 0
  }
}
