import { TypeInfo } from "@web3api/schema-parse";

export type BindLanguage = "wasm-as" | "plugin-ts" | "app-ts";

export type OutputEntry = FileEntry | DirectoryEntry | TemplateEntry;

export interface FileEntry {
  type: "File";
  name: string;
  data: string;
}

export interface DirectoryEntry {
  type: "Directory";
  name: string;
  data: OutputEntry[];
}

export interface TemplateEntry {
  type: "Template";
  name: string;
  data: string;
}

export interface OutputDirectory {
  entries: OutputEntry[];
}

export interface BindModuleOutput {
  name: string;
  output: OutputDirectory;
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
  bindLanguage: BindLanguage;
  modules: BindModuleOptions[];
  commonDirAbs?: string;
}
