import { GenerateBindingFn } from "./types";
import * as WasmAs from "./assemblyscript/wasm-as";
import * as PluginTs from "./typescript/plugin-ts";
import * as AppTs from "./typescript/app-ts";

import { BindLanguage } from "../";

export { WasmAs, PluginTs, AppTs };
export * from "./types";

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
