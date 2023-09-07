import { GenerateBindingFn } from "./types";
import { BindLanguage } from "../";
import * as WrapBindgen from "./wrap-bindgen";
import * as Golang from "./golang";

export { Golang };
export * from "./types";
export * from "./utils";

export function getGenerateBindingFn(
  bindLanguage: BindLanguage
): GenerateBindingFn {
  switch (bindLanguage) {
    case "wrap-as":
      return WrapBindgen.getGenerateBindingFn(
        "wrapscan.io/polywrap/wrap-assemblyscript-abi-bindgen@1"
      );
    case "wrap-rs":
      return WrapBindgen.getGenerateBindingFn(
        "wrapscan.io/polywrap/wrap-rust-abi-bindgen@1"
      );
    case "wrap-go":
      return Golang.Wasm.generateBinding;
    case "wrap-ts":
      return WrapBindgen.getGenerateBindingFn(
        "wrapscan.io/polywrap/wrap-typescript-abi-bindgen@1"
      );
    case "plugin-ts":
      return WrapBindgen.getGenerateBindingFn(
        "wrapscan.io/polywrap/plugin-typescript-abi-bindgen@1"
      );
    case "plugin-rs":
      return WrapBindgen.getGenerateBindingFn(
        "wrapscan.io/polywrap/plugin-rust-abi-bindgen@1"
      );
    case "plugin-py":
      return WrapBindgen.getGenerateBindingFn(
        "wrapscan.io/polywrap/plugin-python-abi-bindgen@1"
      );
    case "plugin-kt":
      return WrapBindgen.getGenerateBindingFn(
        "wrapscan.io/polywrap/plugin-kotlin-abi-bindgen@1"
      );
    case "plugin-swift":
      return WrapBindgen.getGenerateBindingFn(
        "wrapscan.io/polywrap/plugin-swift-abi-bindgen@1"
      );
    case "app-ts":
      return WrapBindgen.getGenerateBindingFn(
        "wrapscan.io/polywrap/app-typescript-abi-bindgen@1"
      );
    case "app-py":
      return WrapBindgen.getGenerateBindingFn(
        "wrapscan.io/polywrap/app-python-abi-bindgen@1"
      );
    case "app-rs":
      return WrapBindgen.getGenerateBindingFn(
        "wrapscan.io/polywrap/app-rust-abi-bindgen@1"
      );
    case "app-swift":
      return WrapBindgen.getGenerateBindingFn(
        "wrapscan.io/polywrap/app-swift-abi-bindgen@1"
      );
    case "app-kt":
      return WrapBindgen.getGenerateBindingFn(
        "wrapscan.io/polywrap/app-kotlin-abi-bindgen@1"
      );
    default:
      throw Error(`Error: Language binding unsupported - ${bindLanguage}`);
  }
}
