import { OutputDirectory, BindLanguage } from "../";
import * as WasmAs from "./wasm-as";
import * as AppTs from "./app-ts";

import { TypeInfo } from "@web3api/schema-parse";

export {
  WasmAs,
  AppTs,
};

export function generateBinding(
  bindLanguage: BindLanguage,
  typeInfo: TypeInfo,
  schema: string
): OutputDirectory {
  switch (bindLanguage) {
    case "wasm-as":
      return WasmAs.generateBinding(typeInfo);
    case "app-ts":
      return AppTs.generateBinding(typeInfo, schema);
    default:
      throw Error(`Error: Language binding unsupported - ${bindLanguage}`);
  }
}
