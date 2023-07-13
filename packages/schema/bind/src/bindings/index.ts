import { GenerateBindingFn } from "./types";
import { BindLanguage } from "../";
import * as Rust from "./rust";
import * as WrapBindgen from "./wrap-bindgen";
import * as Golang from "./golang";

export { Rust, Golang };
export * from "./types";
export * from "./utils";

export function getGenerateBindingFn(
  bindLanguage: BindLanguage
): GenerateBindingFn {
  switch (bindLanguage) {
    case "wrap-as":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/wrap-0.1/implementations/wrap-assemblyscript"
      );
    case "wrap-rs":
      return Rust.Wasm.generateBinding;
    case "wasm-go":
      return Golang.Wasm.generateBinding;
    case "plugin-ts":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/wrap-0.1/implementations/plugin-typescript"
      );
    case "plugin-rs":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/wrap-0.1/implementations/plugin-rust"
      );
    case "plugin-py":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/wrap-0.1/implementations/plugin-python"
      );
    case "plugin-kt":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/wrap-0.1/implementations/plugin-kotlin"
      );
    case "app-ts":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/wrap-0.1/implementations/app-typescript"
      );
    default:
      throw Error(`Error: Language binding unsupported - ${bindLanguage}`);
  }
}
