import { t as fillFromRoot } from "./hast-CWwTaJDq.js";
//#region src/lowlight.ts
function createParser(lowlight) {
	return function highlighter({ content, language, pos }) {
		const root = language ? lowlight.highlight(language, content) : lowlight.highlightAuto(content);
		const decorations = [];
		const from = pos + 1;
		fillFromRoot(decorations, root, from);
		return decorations;
	};
}
//#endregion
export { createParser };

//# sourceMappingURL=lowlight.js.map