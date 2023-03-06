import { Abi, CapabilityType } from "@polywrap/schema-parse";

export interface SchemaFile {
  schema: string;
  absolutePath: string;
}

export type AbiResolver = (
  importFrom: string,
  schemaFile: SchemaFile
) => Promise<Abi | SchemaFile>;

export interface ExternalImport {
  importedTypes: string[];
  namespace: string;
  importFrom: string;
}

export interface Use {
  usedTypes: CapabilityType[];
  namespace: string;
}

export interface LocalImport {
  importedTypes: string[];
  importFrom: string;
}

export const SYNTAX_REFERENCE =
  "External Import:\n" +
  `import { Type, Module } into Namespace from "wrap://valid/uri"\n` +
  `import * into Namespace from "wrap://valid/uri"\n` +
  "Local Import:\n" +
  `import { Type } from "wrap://valid/uri"\n` +
  `import * from "./local/path/file.graphql"`;
