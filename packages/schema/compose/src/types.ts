import { Abi, CapabilityType } from "@polywrap/schema-parse";

export interface SchemaFile {
  schema: string;
  absolutePath: string;
}

export type AbiResolver = (uri: string) => Promise<Abi>;
export type SchemaResolver = (path: string) => Promise<string>;

export interface AbiResolvers {
  external: AbiResolver;
  local: SchemaResolver;
}

export interface ExternalImport {
  importedTypes: string[];
  namespace: string;
  uri: string;
}

export interface Use {
  usedTypes: CapabilityType[];
  namespace: string;
}

export interface LocalImport {
  importedTypes: string[];
  path: string;
}

export const SYNTAX_REFERENCE =
  "External Import:\n" +
  `import { Type, Module } into Namespace from "external.uri"\n` +
  `import * into Namespace from "external.uri"\n` +
  "Local Import:\n" +
  `import { Type } from "./local/path/file.graphql"\n` +
  `import * from "./local/path/file.graphql"`;
