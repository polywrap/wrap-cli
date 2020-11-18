import { TargetLanguage } from "./";
import { generateBinding } from "./bindings";

export interface OutputEntry {
  type: "File" | "Directory";
  name: string;
  data: string | OutputEntry[];
}

export interface OutputDirectory {
  entries: OutputEntry[]
}

export function generateCode(language: TargetLanguage, schema: string): OutputDirectory {
  return generateBinding(language, schema);
}
