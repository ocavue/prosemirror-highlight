import { lowlightPlugin } from './lowlight'
import lowlightCode from './lowlight?raw'
import { setupView } from './setup'
import { shikiPlugin } from './shiki'
import shikiCode from './shiki?raw'

function getOrCreateElement(id: string): HTMLElement {
  let element = document.getElementById(id)
  if (!element) {
    element = document.createElement('div')
    element.id = id
    element.classList.add('editor')
    document.body.appendChild(element)
  }
  return element
}

function main() {
  setupView({
    mount: getOrCreateElement('editor-shiki'),
    plugin: shikiPlugin,
    title: 'Shiki Example',
    code: shikiCode,
  })

  setupView({
    mount: getOrCreateElement('editor-lowlight'),
    plugin: lowlightPlugin,
    title: 'Lowlight Example',
    code: lowlightCode,
  })
}

main()
