import { t as fillFromRoot } from "./hast-HXBCbBz6.js";
// src/refractor.ts
function createParser(refractor) {
	return function highlighter({ content, language, pos }) {
		const root = refractor.highlight(content, language || "");
		const decorations = [];
		const from = pos + 1;
		fillFromRoot(decorations, root, from);
		return decorations;
	};
}
export { createParser };

//# sourceMappingURL=refractor.js.map