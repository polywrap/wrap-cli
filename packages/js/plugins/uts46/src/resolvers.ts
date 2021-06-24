import { PluginModule } from "@web3api/core-js";
import uts46 from "idna-uts46-hx";

export const query = (): PluginModule => ({
  toAscii: (input: { value: string }) => {
    return uts46.toAscii(input.value);
  },
  toUnicode: (input: { value: string }) => {
    return uts46.toUnicode(input.value);
  },
  convert: (input: { value: string }) => {
    return uts46.convert(input.value);
  },
});
