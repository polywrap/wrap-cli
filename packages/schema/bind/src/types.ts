import { OutputDirectory } from "@polywrap/os-js";
import { Abi } from "@polywrap/schema-parse";

export type BindLanguage = "wasm-as" | "wasm-rs" | "plugin-ts" | "app-ts";

export interface BindOutput {
  output: OutputDirectory;
  outputDirAbs: string;
}

export interface BindOptions {
  projectName: string;
  bindLanguage: BindLanguage;
  abi: Abi;
  config?: Record<string, unknown>;
  outputDirAbs: string;
}
