import { Decoration } from "prosemirror-view";
//#region src/hast.ts
function fillFromRoot(decorations, node, from) {
	for (const child of node.children) from = fillFromRootContent(decorations, child, from);
}
function fillFromRootContent(decorations, node, from) {
	if (node.type === "element") {
		const to = from + getElementSize(node);
		const { className, ...rest } = node.properties || {};
		const attrs = {};
		for (const [key, value] of Object.entries(rest)) if (value != null) attrs[key] = String(value);
		attrs.nodeName = node.tagName;
		if (className) attrs.class = Array.isArray(className) ? className.join(" ") : String(className);
		decorations.push(Decoration.inline(from, to, attrs));
		return to;
	} else if (node.type === "text") return from + node.value.length;
	else return from;
}
function getElementSize(node) {
	let size = 0;
	for (const child of node.children) size += getElementContentSize(child);
	return size;
}
function getElementContentSize(node) {
	switch (node.type) {
		case "element": return getElementSize(node);
		case "text": return node.value.length;
		default: return 0;
	}
}
//#endregion
export { fillFromRoot as t };

//# sourceMappingURL=hast-CWwTaJDq.js.map