import { GenerateBindingFn } from "./types";
import { BindLanguage } from "../";
import * as AssemblyScript from "./assemblyscript";
import * as Rust from "./rust";
import * as Python from "./python";
import * as TypeScript from "./typescript";
import * as Kotlin from "./kotlin";

export { AssemblyScript, Rust, TypeScript };
export * from "./types";
export * from "./utils";

export function getGenerateBindingFn(
  bindLanguage: BindLanguage
): GenerateBindingFn {
  switch (bindLanguage) {
    case "wasm-as":
      return AssemblyScript.Wasm.generateBinding;
    case "wasm-rs":
      return Rust.Wasm.generateBinding;
    case "plugin-ts":
      return TypeScript.Plugin.generateBinding;
    case "plugin-rs":
      return Rust.Plugin.generateBinding;
    case "plugin-py":
      return Python.Plugin.generateBinding;
    case "plugin-kt":
      return Kotlin.Plugin.generateBinding;
    case "app-ts":
      return TypeScript.App.generateBinding;
    default:
      throw Error(`Error: Language binding unsupported - ${bindLanguage}`);
  }
}
