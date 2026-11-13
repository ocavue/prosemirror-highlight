import { Decoration } from "prosemirror-view";
import { SugarHigh, tokenize } from "sugar-high/core";
import { lang, languages } from "sugar-high/lang";
// src/sugar-high.ts
const types = SugarHigh.TokenTypes;
function createParser() {
	return function parser({ content, pos, language }) {
		const decorations = [];
		const languageId = language == null ? void 0 : lang(language);
		const languageConfig = languageId && languages.find((lang) => lang.id === languageId)?.config;
		const tokens = tokenize(content, languageConfig);
		let from = pos + 1;
		for (const [type, content] of tokens) {
			const to = from + content.length;
			const decoration = Decoration.inline(from, to, {
				class: `sh__token--${types[type]}`,
				style: `color: var(--sh-${types[type]})`
			});
			decorations.push(decoration);
			from = to;
		}
		return decorations;
	};
}
export { createParser };

//# sourceMappingURL=sugar-high.js.map