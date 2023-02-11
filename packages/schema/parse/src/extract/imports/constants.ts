export const TYPE_NAME_REGEX = `[a-zA-Z0-9_]+`;
export const SYNTAX_REFERENCE =
  "External Import:\n" +
  `import { Type, Module } into Namespace from "external.uri"\n` +
  `import * into Namespace from "external.uri"\n` +
  "Local Import:\n" +
  `import { Type } from "./local/path/file.graphql"\n` +
  `import * from "./local/path/file.graphql"`;