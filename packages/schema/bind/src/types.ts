import { TypeInfo } from "@web3api/schema-parse";
import { OutputDirectory } from "@web3api/os-js";

export type BindLanguage = "wasm-as" | "plugin-ts" | "app-ts";

export interface BindModuleOutput {
  name: string;
  output: OutputDirectory;
  outputDirAbs: string;
}

export interface BindOutput {
  modules: BindModuleOutput[];
  common?: BindModuleOutput;
}

export interface BindModuleOptions {
  name: string;
  typeInfo: TypeInfo;
  schema: string;
  config?: Record<string, unknown>;
  outputDirAbs: string;
}

export interface BindOptions {
  modules: BindModuleOptions[];
  projectName: string;
  bindLanguage: BindLanguage;
  commonDirAbs?: string;
}
