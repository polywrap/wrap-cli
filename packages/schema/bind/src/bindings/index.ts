import { OutputDirectory, BindLanguage } from "../";
import * as WasmAs from "./assemblyscript/wasm-as";
import * as PluginTs from "./typescript/plugin-ts";
import * as AppTs from "./typescript/app-ts";

import { TypeInfo } from "@web3api/schema-parse";

export {
  WasmAs,
  PluginTs,
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
    case "plugin-ts":
      return PluginTs.generateBinding(typeInfo, schema);
    case "app-ts":
      return AppTs.generateBinding(typeInfo, schema);
    default:
      throw Error(`Error: Language binding unsupported - ${bindLanguage}`);
  }
}
