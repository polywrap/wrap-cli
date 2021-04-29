import { OutputDirectory, TargetLanguage } from "../";
import * as WasmAs from "./wasm-as";

import { TypeInfo } from "@web3api/schema-parse";

export function generateBinding(
  language: TargetLanguage,
  typeInfo: TypeInfo
): OutputDirectory {
  switch (language) {
    case "wasm-as":
      return WasmAs.generateBinding(typeInfo);
    default:
      throw Error(`Error: Language binding unsupported - ${language}`);
  }
}
