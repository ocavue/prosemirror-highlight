import { lowlightPlugin } from './lowlight'
import lowlightCode from './lowlight?raw'
import { refractorPlugin } from './refractor'
import refractorCode from './refractor?raw'
import { setupView } from './setup'
import { shikiPlugin } from './shiki'
import { shikiLazyPlugin } from './shiki-lazy'
import shikiLazyCode from './shiki-lazy?raw'
import shikiCode from './shiki?raw'
import { shikijiPlugin } from './shikiji'
import { shikijiLazyPlugin } from './shikiji-lazy'
import shikijiLazyCode from './shikiji-lazy?raw'
import shikijiCode from './shikiji?raw'
import { sugarHighPlugin } from './sugar-high'
import sugarHighCode from './sugar-high?raw'

function getOrCreateElement(id: string): HTMLElement {
  const container = document.getElementById('container')
  if (!container) {
    throw new Error('Container not found')
  }

  let element = document.getElementById(id)
  if (!element) {
    element = document.createElement('div')
    element.id = id
    element.classList.add('editor')
    element.setAttribute('spellcheck', 'false')
    container.appendChild(element)
  }
  return element
}

function main() {
  setupView({
    mount: getOrCreateElement('editor-shiki'),
    plugin: shikiPlugin,
    title: 'Shiki',
    code: shikiCode,
  })

  setupView({
    mount: getOrCreateElement('editor-shikiji'),
    plugin: shikijiPlugin,
    title: 'Shikiji',
    code: shikijiCode,
  })

  setupView({
    mount: getOrCreateElement('editor-lowlight'),
    plugin: lowlightPlugin,
    title: 'lowlight',
    code: lowlightCode,
  })

  setupView({
    mount: getOrCreateElement('editor-refractor'),
    plugin: refractorPlugin,
    title: 'refractor',
    code: refractorCode,
  })

  setupView({
    mount: getOrCreateElement('editor-sugar-high'),
    plugin: sugarHighPlugin,
    title: 'Sugar High',
    code: sugarHighCode,
  })

  setupView({
    mount: getOrCreateElement('editor-shiki-lazy'),
    plugin: shikiLazyPlugin,
    title: 'Shiki (Lazy language loading)',
    code: shikiLazyCode,
  })

  setupView({
    mount: getOrCreateElement('editor-shikiji-lazy'),
    plugin: shikijiLazyPlugin,
    title: 'Shikiji (Lazy language loading)',
    code: shikijiLazyCode,
  })
}

main()
