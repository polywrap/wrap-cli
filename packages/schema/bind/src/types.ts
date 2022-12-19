import { OutputDirectory } from "@polywrap/os-js";
import { WrapAbi } from "@polywrap/schema-parse";

export type BindLanguage =
  | "wasm-as"
  | "wasm-rs"
  | "plugin-ts"
  | "plugin-rs"
  | "app-ts";

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
