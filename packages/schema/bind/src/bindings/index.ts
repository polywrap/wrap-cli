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
        "https://github.com/polywrap/wrap-abi-bindgen/tree/wrap-0.1/implementations/wrap-assemblyscript"
      );
    case "wrap-rs":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/wrap-0.1/implementations/wrap-rust"
      );
    case "wrap-go":
      return Golang.Wasm.generateBinding;
    case "plugin-ts":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/wrap-0.1/implementations/plugin-typescript"
      );
    case "plugin-rs":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/nk/fix-rs-plugin/implementations/plugin-rust"
      );
    case "plugin-py":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/wrap-0.1/implementations/plugin-python"
      );
    case "plugin-kt":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/wrap-0.1/implementations/plugin-kotlin"
      );
    case "plugin-swift":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/wrap-0.1/implementations/plugin-swift"
      );
    case "app-ts":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/nk/ts-app-codegen/implementations/app-typescript"
      );
    case "app-py":
      return WrapBindgen.getGenerateBindingFn(
        "https://github.com/polywrap/wrap-abi-bindgen/tree/nk/py-app-codegen/implementations/app-python"
      );
    default:
      throw Error(`Error: Language binding unsupported - ${bindLanguage}`);
  }
}
