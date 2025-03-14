# prosemirror-highlight

[![NPM version](https://img.shields.io/npm/v/prosemirror-highlight?color=a1b858&label=)](https://www.npmjs.com/package/prosemirror-highlight)

Highlight your [ProseMirror] code blocks with any syntax highlighter you like!

## Usage

### With [Shiki]

<details>
<summary>Static loading of a fixed set of languages</summary>

```ts
import { getSingletonHighlighter } from 'shiki'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/shiki'

const highlighter = await getSingletonHighlighter({
  themes: ['github-light'],
  langs: ['javascript', 'typescript', 'python'],
})
const parser = createParser(highlighter)
export const shikiPlugin = createHighlightPlugin({ parser })
```

</details>

<details>
<summary>Dynamic loading of arbitrary languages</summary>

```ts
import {
  getSingletonHighlighter,
  type BuiltinLanguage,
  type Highlighter,
} from 'shiki'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser, type Parser } from 'prosemirror-highlight/shiki'

let highlighter: Highlighter | undefined
let parser: Parser | undefined

/**
 * Lazy load highlighter and highlighter languages.
 *
 * When the highlighter or the required language is not loaded, it returns a
 * promise that resolves when the highlighter or the language is loaded.
 * Otherwise, it returns an array of decorations.
 */
const lazyParser: Parser = (options) => {
  if (!highlighter) {
    return getSingletonHighlighter({
      themes: ['github-light'],
      langs: [],
    }).then((h) => {
      highlighter = h
    })
  }

  const language = options.language as BuiltinLanguage
  if (language && !highlighter.getLoadedLanguages().includes(language)) {
    return highlighter.loadLanguage(language)
  }

  if (!parser) {
    parser = createParser(highlighter)
  }

  return parser(options)
}

export const shikiLazyPlugin = createHighlightPlugin({ parser: lazyParser })
```

</details>

<details>
<summary>Set code block background color based on theme</summary>

When using Shiki, two CSS variables are set automatically to the `<pre>` element:

- `--prosemirror-highlight`: The text color of the code block
- `--prosemirror-highlight-bg`: The background color of the code block

You can use these variables to set the background color and text color of the code block.

```css
.ProseMirror pre {
  color: var(--prosemirror-highlight, inherit);
  background-color: var(--prosemirror-highlight-bg, inherit);
}
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
import { refractor } from 'refractor/all'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/refractor'

const parser = createParser(refractor)
export const refractorPlugin = createHighlightPlugin({ parser })
```

</details>

### With [Sugar high]

<details>
<summary>Highlight with CSS</summary>

```ts
import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/sugar-high'

const parser = createParser()
export const sugarHighPlugin = createHighlightPlugin({ parser })
```

```css
:root {
  --sh-class: #2d5e9d;
  --sh-identifier: #354150;
  --sh-sign: #8996a3;
  --sh-property: #0550ae;
  --sh-entity: #249a97;
  --sh-jsxliterals: #6266d1;
  --sh-string: #00a99a;
  --sh-keyword: #f47067;
  --sh-comment: #a19595;
}
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
[refractor]: https://github.com/wooorm/refractor
[Prism]: https://github.com/PrismJS/prism
[Sugar high]: https://github.com/huozhi/sugar-high
