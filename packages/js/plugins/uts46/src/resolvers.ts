import { Query } from "./w3";
import uts46 from "idna-uts46-hx";

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
