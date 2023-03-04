import { SchemaFile, AbiResolver } from "./types";
import { resolveImportsAndParseSchemas } from "./resolve";
import { renderSchema } from "./render";

import { WrapAbi } from "@polywrap/wrap-manifest-types-js";

export * from "./types";
export { renderSchema };

export interface ComposerOptions {
  schema: SchemaFile;
  abiResolver: AbiResolver;
}

export async function composeSchema(
  options: ComposerOptions
): Promise<WrapAbi> {
  return await resolveImportsAndParseSchemas(
    options.schema.schema,
    options.schema.absolutePath,
    options.abiResolver
  );
}
