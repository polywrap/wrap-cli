import { OutputDirectory } from "@polywrap/os-js";
import { WrapAbi } from "@polywrap/wrap-manifest-types-js";

export type BindLanguage = "wasm-as" | "wasm-rs" | "plugin-ts" | "app-ts";

export interface BindOutput {
  output: OutputDirectory;
  outputDirAbs: string;
}

export interface BindOptions {
  projectName: string;
  bindLanguage: BindLanguage;
  abi: WrapAbi;
  config?: Record<string, unknown>;
  outputDirAbs: string;
}
