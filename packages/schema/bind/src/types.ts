import { Abi } from "@polywrap/schema-parse";
import { OutputDirectory } from "@polywrap/os-js";

export type BindLanguage = "wasm-as" | "wasm-rs" | "plugin-ts" | "app-ts";

export interface BindOutput {
  output: OutputDirectory;
  outputDirAbs: string;
}

export interface BindOptions {
  projectName: string;
  bindLanguage: BindLanguage;
  abi: Abi;
  schema: string;
  config?: Record<string, unknown>;
  outputDirAbs: string;
}
