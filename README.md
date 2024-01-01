# prosemirror-highlight

[![NPM version](https://img.shields.io/npm/v/prosemirror-highlight?color=a1b858&label=)](https://www.npmjs.com/package/prosemirror-highlight)

Highlight your code blocks in [ProseMirror], with any syntax highlighter you like!

## Usage

### With [Shiki]

<details>
<summary>Static loading of a fixed set of languages</summary>

```ts
import { getHighlighter, setCDN } from 'shiki'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/shiki'

setCDN('https://unpkg.com/shiki@0.14.6/')

const highlighter = await getHighlighter({
  theme: 'github-light',
  langs: ['javascript', 'typescript', 'python'],
})
const parser = createParser(highlighter)
export const shikiPlugin = createHighlightPlugin({ parser })
```

</details>

<details>
<summary>Dynamic loading of arbitrary languages</summary>

```ts
import { getHighlighter, setCDN, type Highlighter, type Lang } from 'shiki'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser, type Parser } from 'prosemirror-highlight/shiki'

setCDN('https://unpkg.com/shiki@0.14.6/')

let highlighterPromise: Promise<void> | undefined
let highlighter: Highlighter | undefined
let parser: Parser | undefined
const loadedLanguages = new Set<string>()

/**
 * Lazy load highlighter and highlighter languages.
 *
 * When the highlighter or the required language is not loaded, it returns a
 * promise that resolves when the highlighter or the language is loaded.
 * Otherwise, it returns an array of decorations.
 */
const lazyParser: Parser = (options) => {
  if (!highlighterPromise) {
    highlighterPromise = getHighlighter({
      themes: ['github-light'],
      langs: [],
    }).then((h) => {
      highlighter = h
    })
    return highlighterPromise
  }

  if (!highlighter) {
    return highlighterPromise
  }

  const language = options.language
  if (language && !loadedLanguages.has(language)) {
    return highlighter.loadLanguage(language as Lang).then(() => {
      loadedLanguages.add(language)
    })
  }

  if (!parser) {
    parser = createParser(highlighter)
  }

  return parser(options)
}

export const shikiLazyPlugin = createHighlightPlugin({ parser: lazyParser })
```

</details>

### With [Shikiji]

<details>
<summary>Static loading of a fixed set of languages</summary>

```ts
import { getHighlighter } from 'shikiji'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/shikiji'

const highlighter = await getHighlighter({
  themes: ['vitesse-light'],
  langs: ['javascript', 'typescript', 'python'],
})
const parser = createParser(highlighter)
export const shikijiPlugin = createHighlightPlugin({ parser })
```

</details>

<details>
<summary>Dynamic loading of arbitrary languages</summary>

```ts
import { getHighlighter, type Highlighter, type BuiltinLanguage } from 'shikiji'

import { createHighlightPlugin, type Parser } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/shikiji'

let highlighterPromise: Promise<void> | undefined
let highlighter: Highlighter | undefined
let parser: Parser | undefined
const loadedLanguages = new Set<string>()

/**
 * Lazy load highlighter and highlighter languages.
 *
 * When the highlighter or the required language is not loaded, it returns a
 * promise that resolves when the highlighter or the language is loaded.
 * Otherwise, it returns an array of decorations.
 */
const lazyParser: Parser = (options) => {
  if (!highlighterPromise) {
    highlighterPromise = getHighlighter({
      themes: ['vitesse-light'],
      langs: [],
    }).then((h) => {
      highlighter = h
    })
    return highlighterPromise
  }

  if (!highlighter) {
    return highlighterPromise
  }

  const language = options.language
  if (language && !loadedLanguages.has(language)) {
    return highlighter.loadLanguage(language as BuiltinLanguage).then(() => {
      loadedLanguages.add(language)
    })
  }

  if (!parser) {
    parser = createParser(highlighter)
  }

  return parser(options)
}

export const shikijiLazyPlugin = createHighlightPlugin({ parser: lazyParser })
```

</details>

### With [lowlight] (based on [Highlight.js])

<details>
<summary>Static loading of all languages</summary>

```ts
import 'highlight.js/styles/default.css'

import { common, createLowlight } from 'lowlight'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/lowlight'

const lowlight = createLowlight(common)
const parser = createParser(lowlight)
export const lowlightPlugin = createHighlightPlugin({ parser })
```

</details>

### With [refractor] (based on [Prism])

<details>
<summary>Static loading of all languages</summary>

```ts
import { refractor } from 'refractor'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/refractor'

const parser = createParser(refractor)
export const refractorPlugin = createHighlightPlugin({ parser })
```

</details>

## Online demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ocavue/prosemirror-highlight?file=playground%2Fmain.ts)

## Credits

- [prosemirror-highlightjs] - Highlight.js syntax highlighting for ProseMirror

## License

MIT

[ProseMirror]: https://prosemirror.net
[prosemirror-highlightjs]: https://github.com/b-kelly/prosemirror-highlightjs
[lowlight]: https://github.com/wooorm/lowlight
[Highlight.js]: https://github.com/highlightjs/highlight.js
[Shiki]: https://github.com/shikijs/shiki
[Shikiji]: https://github.com/antfu/shikiji
[refractor]: https://github.com/wooorm/refractor
[Prism]: https://github.com/PrismJS/prism
