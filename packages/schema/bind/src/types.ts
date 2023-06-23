import { OutputDirectory } from "@polywrap/os-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export type BindLanguage =
  | "wrap-as"
  | "wrap-rs"
  | "plugin-ts"
  | "plugin-rs"
  | "plugin-py"
  | "app-ts";

export interface BindOutput {
  output: OutputDirectory;
  outputDirAbs: string;
}

export interface BindOptions {
  bindLanguage: BindLanguage;
  wrapInfo: WrapManifest;
  config?: Record<string, unknown>;
  outputDirAbs: string;
}
