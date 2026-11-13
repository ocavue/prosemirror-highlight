import { n as Parser } from "./types-Cu_XqW3r.js";
import { Root } from "hast";
export type Lowlight = {
  highlight: (language: string, value: string) => Root;
  highlightAuto: (value: string) => Root;
};
export declare function createParser(lowlight: Lowlight): Parser;
export type { Parser };
//# sourceMappingURL=lowlight.d.ts.map