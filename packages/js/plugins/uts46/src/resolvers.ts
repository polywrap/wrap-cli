import { Query } from "./w3";

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const uts46 = require("idna-uts46-hx/uts46bundle.js");

export const query = (): Query.Module => ({
  toAscii: (input: Query.Input_toAscii) => {
    return uts46.toAscii(input.value);
  },
  toUnicode: (input: Query.Input_toUnicode) => {
    return uts46.toUnicode(input.value);
  },
  convert: (input: Query.Input_convert) => {
    return uts46.convert(input.value);
  },
});
