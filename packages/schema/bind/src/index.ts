import { generateBinding } from "./bindings";

export * from "./utils/fs";

export type TargetLanguage = "wasm-as";

export type OutputEntry = FileEntry | DirectoryEntry;

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

export interface OutputDirectory {
  entries: OutputEntry[];
}

export function bindSchema(
  language: TargetLanguage,
  schema: string
): OutputDirectory {
  return generateBinding(language, schema);
}
