import { OutputDirectory, BindLanguage } from "../";
import * as WasmAs from "./wasm-as";
import * as PluginTs from "./plugin-ts";

import { TypeInfo } from "@web3api/schema-parse";

export { toTypescript } from "./plugin-ts";

export function generateBinding(
  bindLanguage: BindLanguage,
  typeInfo: TypeInfo,
  schema: string
): OutputDirectory {
  switch (bindLanguage) {
    case "wasm-as":
      return WasmAs.generateBinding(typeInfo);
    case "plugin-ts":
      return PluginTs.generateBinding(typeInfo, schema);
    default:
      throw Error(`Error: Language binding unsupported - ${bindLanguage}`);
  }
}
