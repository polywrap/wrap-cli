import { OutputDirectory } from "@polywrap/os-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export const bindLanguage = {
  "wrap-as": "wrap-as",
  "wrap-rs": "wrap-rs",
  "wrap-go": "wrap-go",
  "plugin-ts": "plugin-ts",
  "plugin-rs": "plugin-rs",
  "plugin-py": "plugin-py",
  "plugin-kt": "plugin-kt",
  "plugin-swift": "plugin-swift",
  "app-ts": "app-ts",
  "app-swift": "app-swift",
};

export type BindLanguages = typeof bindLanguage;

export type BindLanguage = keyof BindLanguages;

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
