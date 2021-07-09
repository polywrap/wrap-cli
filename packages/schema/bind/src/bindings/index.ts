import { OutputDirectory, TargetLanguage } from "../";
import * as WasmAs from "./wasm-as";
import * as WasmRs from "./wasm-rs";

import { TypeInfo } from "@web3api/schema-parse";

export function generateBinding(
  language: TargetLanguage,
  typeInfo: TypeInfo
): OutputDirectory {
  switch (language) {
    case "wasm-as":
      return WasmAs.generateBinding(typeInfo);
    case "wasm-rs":
      return WasmRs.generateBinding(typeInfo);
    default:
      throw Error(`Error: Language binding unsupported - ${language}`);
  }
}
