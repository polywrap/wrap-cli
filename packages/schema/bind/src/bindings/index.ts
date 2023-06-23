import { GenerateBindingFn } from "./types";
import { BindLanguage } from "../";
import * as AssemblyScript from "./assemblyscript";
import * as Rust from "./rust";
import * as Python from "./python";
import * as TypeScript from "./typescript";
import * as WrapBindgen from "./wrap-bindgen";

export { AssemblyScript, Rust, TypeScript };
export * from "./types";
export * from "./utils";

export function getGenerateBindingFn(
  bindLanguage: BindLanguage
): GenerateBindingFn {
  switch (bindLanguage) {
    case "wrap-as":
      return WrapBindgen.getGenerateBindingFn(
        `file/${__dirname}/../../../../../../wrap-abi-bindgen/implementations/wrap-assemblyscript/build`
      );
    case "wrap-rs":
      return Rust.Wasm.generateBinding;
    case "plugin-ts":
      return TypeScript.Plugin.generateBinding;
    case "plugin-rs":
      return Rust.Plugin.generateBinding;
    case "plugin-py":
      return Python.Plugin.generateBinding;
    case "app-ts":
      return TypeScript.App.generateBinding;
    default:
      throw Error(`Error: Language binding unsupported - ${bindLanguage}`);
  }
}
