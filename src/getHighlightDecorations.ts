import type { Emitter, HLJSApi, HLJSOptions } from 'highlight.js'
import type { Node as ProseMirrorNode } from 'prosemirror-model'
import { Decoration } from 'prosemirror-view'

/** TODO default emitter type for hljs */
interface TokenTreeEmitter extends Emitter {
  options: HLJSOptions
  walk: (r: Renderer) => void
}

type DataNode = { scope?: string; sublanguage?: boolean }

interface Renderer {
  addText: (text: string) => void
  openNode: (node: DataNode) => void
  closeNode: (node: DataNode) => void
  value: () => unknown
}

type RendererNode = {
  from: number
  to: number
  scope?: string
  classes: string
}

/**
 * Gets all nodes with a type in nodeTypes from a document
 * @param doc The document to search
 * @param nodeTypes The types of nodes to get
 */
function getNodesOfType(
  doc: ProseMirrorNode,
  nodeTypes: string[],
): { node: ProseMirrorNode; pos: number }[] {
  const blocks: { node: ProseMirrorNode; pos: number }[] = []

  if (nodeTypes.includes('doc')) {
    blocks.push({ node: doc, pos: -1 })
  }

  doc.descendants((child, pos) => {
    if (child.isBlock && nodeTypes.includes(child.type.name)) {
      blocks.push({
        node: child,
        pos: pos,
      })

      return false
    }

    return
  })

  return blocks
}

interface GetHighlightDecorationsOptions {
  /**
   * A method that is called before the render process begins where any non-null return value cancels the render; useful for decoration caching on untouched nodes
   * @param block The node that is about to render
   * @param pos The position in the document of the node
   * @returns An array of the decorations that should be used instead of rendering; cancels the render if a non-null value is returned
   */
  preRenderer?: (block: ProseMirrorNode, pos: number) => Decoration[] | null

  /**
   * A method that is called after the render process ends with the result of the node render passed; useful for decoration caching
   * @param block The node that was renderer
   * @param pos The position of the node in the document
   * @param decorations The decorations that were rendered for this node
   */
  postRenderer?: (
    block: ProseMirrorNode,
    pos: number,
    decorations: Decoration[],
  ) => void

  /**
   * A method that is called when a block is autohighlighted with the detected language passed; useful for caching the detected language for future use
   * @param block The node that was renderer
   * @param pos The position of the node in the document
   * @param detectedLanguage The language that was detected during autohighlight
   */
  autohighlightCallback?: (
    block: ProseMirrorNode,
    pos: number,
    detectedLanguage: string | undefined,
  ) => void
}

/**
 * Gets all highlighting decorations from a ProseMirror document
 * @param doc The doc to search applicable blocks to highlight
 * @param hljs The pre-configured highlight.js instance to use for parsing
 * @param nodeTypes An array containing all the node types to target for highlighting
 * @param languageExtractor A method that is passed a prosemirror node and returns the language string to use when highlighting that node
 * @param options The options to alter the behavior of getHighlightDecorations
 */
export function getHighlightDecorations(
  doc: ProseMirrorNode,
  hljs: HLJSApi,
  nodeTypes: string[],
  languageExtractor: (node: ProseMirrorNode) => string | null,
  options?: GetHighlightDecorationsOptions,
): Decoration[] {
  if (!doc || !doc.nodeSize || !nodeTypes?.length || !languageExtractor) {
    return []
  }

  const blocks = getNodesOfType(doc, nodeTypes)

  let decorations: Decoration[] = []

  blocks.forEach((b) => {
    // attempt to run the prerenderer if it exists
    if (options?.preRenderer) {
      const prerenderedDecorations = options.preRenderer(b.node, b.pos)

      // if the returned decorations are non-null, use them instead of rendering our own
      if (prerenderedDecorations) {
        decorations = [...decorations, ...prerenderedDecorations]
        return
      }
    }

    const language = languageExtractor(b.node)

    // if the langauge is specified, but isn't loaded, skip highlighting
    if (language && !hljs.getLanguage(language)) {
      return
    }

    const result = language
      ? hljs.highlight(b.node.textContent, { language })
      : hljs.highlightAuto(b.node.textContent)

    // if we autohighlighted and have a callback set, call it
    if (!language && result.language && options?.autohighlightCallback) {
      options.autohighlightCallback(b.node, b.pos, result.language)
    }

    const emitter = result._emitter as TokenTreeEmitter

    const renderer = new ProseMirrorRenderer(
      emitter,
      b.pos,
      emitter.options.classPrefix,
    )

    const value = renderer.value()

    const localDecorations: Decoration[] = []
    value.forEach((v) => {
      if (!v.scope) {
        return
      }

      const decoration = Decoration.inline(v.from, v.to, {
        class: v.classes,
      })

      localDecorations.push(decoration)
    })

    if (options?.postRenderer) {
      options.postRenderer(b.node, b.pos, localDecorations)
    }

    decorations = [...decorations, ...localDecorations]
  })

  return decorations
}

class ProseMirrorRenderer implements Renderer {
  private buffer: RendererNode[]
  private nodeQueue: RendererNode[]
  private classPrefix: string
  private currentPosition: number

  constructor(
    tree: TokenTreeEmitter,
    startingBlockPos: number,
    classPrefix: string,
  ) {
    this.buffer = []
    this.nodeQueue = []
    this.classPrefix = classPrefix
    this.currentPosition = startingBlockPos + 1
    tree.walk(this)
  }

  get currentNode() {
    return this.nodeQueue.length > 0 ? this.nodeQueue.slice(-1) : null
  }

  addText(text: string) {
    const node = this.currentNode

    if (!node) {
      return
    }

    this.currentPosition += text.length
  }

  openNode(node: DataNode) {
    let className = node.scope || ''
    if (node.sublanguage) {
      className = `language-${className}`
    } else {
      className = this.expandScopeName(className)
    }

    const item = this.newNode()
    item.scope = node.scope
    item.classes = className
    item.from = this.currentPosition

    this.nodeQueue.push(item)
  }

  closeNode(node: DataNode) {
    const item = this.nodeQueue.pop()

    // will this ever happen in practice?
    // if the nodeQueue is empty, we have nothing to close
    if (!item) {
      throw 'Cannot close node!'
    }

    item.to = this.currentPosition

    // will this ever happen in practice?
    if (node.scope !== item.scope) {
      throw 'Mismatch!'
    }

    this.buffer.push(item)
  }

  value() {
    return this.buffer
  }

  private newNode(): RendererNode {
    return {
      from: 0,
      to: 0,
      scope: undefined,
      classes: '',
    }
  }

  // TODO logic taken from upstream
  private expandScopeName(name: string): string {
    if (name.includes('.')) {
      const pieces = name.split('.')
      const prefix = pieces.shift() || ''
      return [
        `${this.classPrefix}${prefix}`,
        ...pieces.map((x, i) => `${x}${'_'.repeat(i + 1)}`),
      ].join(' ')
    }
    return `${this.classPrefix}${name}`
  }
}
