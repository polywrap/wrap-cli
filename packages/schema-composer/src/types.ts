export type SchemaResolver = (uriOrPath: string) => string;

export interface SchemaFile {
  schema: string;
  absolutePath: string;
}

export interface SchemaResolvers {
  external: SchemaResolver;
  local: SchemaResolver;
}

export interface ComposerOptions {
  schemas: {
    query?: SchemaFile;
    mutation?: SchemaFile;
  },
  resolvers: SchemaResolvers;
}

export interface ComposerOutput {
  query?: string;
  mutation?: string;
  combined?: string;
}

export interface ExternalImport {
  importedTypes: string[];
  namespace: string;
  uri: string;
}

export interface LocalImport {
  userTypes: string[];
  path: string;
}

export const SYNTAX_REFERENCE =
`External Import: import { Type, Query } into Namespace from "external.uri"\n` +
`Local Import: import { Type } from "./local/path/file.graphql"`;
