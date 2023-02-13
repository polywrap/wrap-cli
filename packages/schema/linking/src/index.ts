import { SchemaFile } from "./types";
import { resolveImportsAndParseSchemas } from "./resolve";
import { renderSchema } from "./render";

import { WrapAbi } from "@polywrap/wrap-manifest-types-js";

export * from "./types";
export { renderSchema };

export interface ComposerOptions {
  schema: SchemaFile;
  abis: Map<string, WrapAbi>;
  schemas: Map<string, string>;
}

export async function composeSchema(
  options: ComposerOptions
): Promise<WrapAbi> {
  return await resolveImportsAndParseSchemas(
    options.schema.schema,
    options.schema.absolutePath,
    options.schemas,
    options.abis
  );
}
