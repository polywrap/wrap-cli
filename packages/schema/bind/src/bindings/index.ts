import { GenerateBindingFn } from "./types";
import { BindLanguage } from "../";
import * as AssemblyScript from "./assemblyscript";
import * as Rust from "./rust";
import * as TypeScript from "./typescript";
import * as Golang from "./golang";

export { AssemblyScript, Rust, TypeScript, Golang };
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
    case "wasm-go":
      return Golang.Wasm.generateBinding;
    case "plugin-ts":
      return TypeScript.Plugin.generateBinding;
    case "app-ts":
      return TypeScript.App.generateBinding;
    default:
      throw Error(`Error: Language binding unsupported - ${bindLanguage}`);
  }
}
