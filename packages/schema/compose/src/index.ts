import { SchemaFile, AbiResolvers } from "./types";
import { resolveImportsAndParseSchemas } from "./resolve";
import { renderSchema } from "./render";

import { WrapAbi } from "@polywrap/wrap-manifest-types-js";

export * from "./types";
export { renderSchema };

export interface ComposerOptions {
  schema: SchemaFile;
  resolvers: AbiResolvers;
}

export async function composeSchema(
  options: ComposerOptions
): Promise<WrapAbi> {
  return await resolveImportsAndParseSchemas(
    options.schema.schema,
    options.schema.absolutePath,
    options.resolvers
  );
}
