import { TypeInfo } from "@web3api/schema-parse";
import { OutputDirectory } from "@web3api/os-js";

export type BindLanguage = "wasm-as" | "wasm-rs" | "plugin-ts" | "app-ts";

export interface BindOutput {
  output: OutputDirectory;
  outputDirAbs: string;
}

export interface BindOptions {
  projectName: string;
  bindLanguage: BindLanguage;
  typeInfo: TypeInfo;
  schema: string;
  config?: Record<string, unknown>;
  outputDirAbs: string;
}
