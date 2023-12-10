import { lowlightPlugin } from './lowlight'
import lowlightCode from './lowlight?raw'
import { refractorPlugin } from './refractor'
import refractorCode from './refractor?raw'
import { setupView } from './setup'
import { shikiPlugin } from './shiki'
import shikiCode from './shiki?raw'
import { shikijiPlugin } from './shikiji'
import shikijiCode from './shikiji?raw'

function getOrCreateElement(id: string): HTMLElement {
  let element = document.getElementById(id)
  if (!element) {
    element = document.createElement('div')
    element.id = id
    element.classList.add('editor')
    element.setAttribute('spellcheck', 'false')
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
    mount: getOrCreateElement('editor-shikiji'),
    plugin: shikijiPlugin,
    title: 'Shikiji Example',
    code: shikijiCode,
  })

  setupView({
    mount: getOrCreateElement('editor-lowlight'),
    plugin: lowlightPlugin,
    title: 'lowlight Example',
    code: lowlightCode,
  })

  setupView({
    mount: getOrCreateElement('editor-refractor'),
    plugin: refractorPlugin,
    title: 'refractor Example',
    code: refractorCode,
  })
}

main()
