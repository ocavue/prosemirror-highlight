import { t as fillFromRoot } from "./hast-CWwTaJDq.js";
//#region src/refractor.ts
function createParser(refractor) {
	return function highlighter({ content, language, pos }) {
		const root = refractor.highlight(content, language || "");
		const decorations = [];
		const from = pos + 1;
		fillFromRoot(decorations, root, from);
		return decorations;
	};
}
//#endregion
export { createParser };

//# sourceMappingURL=refractor.js.map