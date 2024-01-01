# prosemirror-highlight

[![NPM version](https://img.shields.io/npm/v/prosemirror-highlight?color=a1b858&label=)](https://www.npmjs.com/package/prosemirror-highlight)

Highlight your code blocks in [ProseMirror], with any syntax highlighter you like!

## Usage

<details>
  <summary>
  ### With [Shiki]
  </summary>

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

### With [Shikiji]

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

### With [lowlight] (based on [Highlight.js])

```ts
import 'highlight.js/styles/default.css'

import { common, createLowlight } from 'lowlight'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/lowlight'

const lowlight = createLowlight(common)
const parser = createParser(lowlight)
export const lowlightPlugin = createHighlightPlugin({ parser })
```

### With [refractor] (based on [Prism])

```ts
import { refractor } from 'refractor'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { createParser } from 'prosemirror-highlight/refractor'

const parser = createParser(refractor)
export const refractorPlugin = createHighlightPlugin({ parser })
```

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
