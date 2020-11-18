import { OutputDirectory, TargetLanguage } from "../";
import * as WasmAs from "./wasm-as";

export function generateBinding(language: TargetLanguage, schema: string): OutputDirectory {
  switch (language) {
    case "wasm-as":
      return WasmAs.generateBinding(schema);
    default:
      throw Error(`Error: Language binding unsupported - ${language}`);
  }
}
