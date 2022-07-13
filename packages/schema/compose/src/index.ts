import { SchemaFile, AbiResolvers } from "./types";
import { resolveImportsAndParseSchemas } from "./resolve";
import { renderSchema } from "./render";

import { Abi } from "@polywrap/schema-parse";

export * from "./types";
export { renderSchema };

export interface ComposerOptions {
  manifest: SchemaFile;
  resolvers: AbiResolvers;
}

export async function composeSchema(options: ComposerOptions): Promise<Abi> {
  return await resolveImportsAndParseSchemas(
    options.manifest.schema,
    options.manifest.absolutePath,
    options.resolvers
  );
}
