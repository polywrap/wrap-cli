import { CapabilityType, TypeInfo } from "@web3api/schema-parse";

export interface SchemaFile {
  schema: string;
  absolutePath: string;
}

export const schemaKinds = ["query", "mutation", "plugin", "combined"] as const;

export type SchemaKind = typeof schemaKinds[number];

export interface SchemaInfo {
  schema?: string;
  typeInfo?: TypeInfo;
}

export type SchemaInfos = Record<SchemaKind, SchemaInfo>;

export type SchemaResolver = (uriOrPath: string) => Promise<string>;

export interface SchemaResolvers {
  external: SchemaResolver;
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
  `import { Type, Query } into Namespace from "external.uri"\n` +
  `import * into Namespace from "external.uri"\n` +
  "Local Import:\n" +
  `import { Type } from "./local/path/file.graphql"\n` +
  `import * from "./local/path/file.graphql"`;
