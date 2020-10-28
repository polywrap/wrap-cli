import { TargetLanguage, Schema } from "./";
import { generateBinding } from "./bindings";

export interface OutputEntry {
  type: "File" | "Directory";
  name: string;
  data: string | OutputEntry[];
}

export interface OutputDirectory {
  entries: OutputEntry[]
}

export function generateCode(language: TargetLanguage, schema: Schema): OutputDirectory {
  return generateBinding(language, schema);
}
