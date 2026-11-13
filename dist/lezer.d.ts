import { n as Parser, r as ParserOptions } from "./types-Cu_XqW3r.js";
import { Highlighter } from "@lezer/highlight";
import { Tree } from "@lezer/common";
export declare function createParser({ parse, highlighter }: {
  parse: (options: ParserOptions) => Tree | undefined;
  highlighter: Highlighter | readonly Highlighter[];
}): Parser;
export type { Parser, ParserOptions };
//# sourceMappingURL=lezer.d.ts.map