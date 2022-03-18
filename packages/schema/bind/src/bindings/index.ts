import { OutputDirectory, BindLanguage } from "../";
import * as WasmAs from "./assemblyscript/wasm-as";
import * as PluginTs from "./typescript/plugin-ts";
import * as AppTs from "./typescript/app-ts";

import { TypeInfo } from "@web3api/schema-parse";

export { WasmAs, PluginTs, AppTs };

export type GenerateBindingFn = (
  output: OutputDirectory,
  typeInfo: TypeInfo,
  schema: string,
  config: Record<string, unknown>
) => void;

export function getGenerateBindingFn(
  bindLanguage: BindLanguage
): GenerateBindingFn {
  switch (bindLanguage) {
    case "wasm-as":
      return WasmAs.generateBinding;
    case "plugin-ts":
      return PluginTs.generateBinding;
    case "app-ts":
      return AppTs.generateBinding;
    default:
      throw Error(`Error: Language binding unsupported - ${bindLanguage}`);
  }
}

export function generateBinding(
  bindLanguage: BindLanguage,
  typeInfo: TypeInfo,
  schema: string,
  config: Record<string, unknown>
): OutputDirectory {
  const output: OutputDirectory = {
    entries: [],
  };

  getGenerateBindingFn(bindLanguage)(output, typeInfo, schema, config);

  return output;
}
