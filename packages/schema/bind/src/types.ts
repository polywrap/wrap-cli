import { OutputDirectory } from "@polywrap/os-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export type BindLanguage =
  | "wrap-as"
  | "wrap-rs"
  | "wrap-go"
  | "plugin-ts"
  | "plugin-rs"
  | "plugin-py"
  | "plugin-kt"
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

// TODO: Can I use types instead of hardcoded values here?
export function bindLanguageToWrapInfoType(
  bindLanguage: BindLanguage
): "wasm" | "plugin" | "interface" {
  return bindLanguage.startsWith("plugin") ? "plugin" : "wasm";
}
