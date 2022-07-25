import { GenerateBindingFn } from "./types";
import * as WasmAs from "./assemblyscript/wasm-as";
import * as WasmRs from "./rust/wasm-rs";
import * as WasmGo from "./golang/wasm-go";
import * as PluginTs from "./typescript/plugin-ts";
import * as AppTs from "./typescript/app-ts";
import { BindLanguage } from "../";

export { WasmAs, WasmRs, PluginTs, AppTs };
export * from "./types";

export function getGenerateBindingFn(
  bindLanguage: BindLanguage
): GenerateBindingFn {
  switch (bindLanguage) {
    case "wasm-as":
      return WasmAs.generateBinding;
    case "wasm-rs":
      return WasmRs.generateBinding;
    case "wasm-go":
      return WasmGo.generateBinding;
    case "plugin-ts":
      return PluginTs.generateBinding;
    case "app-ts":
      return AppTs.generateBinding;
    default:
      throw Error(`Error: Language binding unsupported - ${bindLanguage}`);
  }
}
