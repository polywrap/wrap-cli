import { GenerateBindingFn } from "./types";
import { BindLanguage } from "../";
import * as AssemblyScript from "./assemblyscript";
import * as Rust from "./rust";
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
        "https://github.com/polywrap/wrap-abi-bindgen/tree/dev/implementations/wrap-assemblyscript"
      );
    case "wrap-rs":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/kris/wrap-rust/implementations/wrap-rust"
      );
    case "plugin-ts":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/dev/implementations/plugin-typescript"
      );
    case "plugin-rs":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/dev/implementations/plugin-rust"
      );
    case "plugin-py":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/dev/implementations/plugin-python"
      );
    case "plugin-kt":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/dev/implementations/plugin-kotlin"
      );
    case "app-ts":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/dev/implementations/app-typescript"
      );
    default:
      throw Error(`Error: Language binding unsupported - ${bindLanguage}`);
  }
}
