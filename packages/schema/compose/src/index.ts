import { SchemaFile, SchemaResolvers } from "./types";
import { resolveImportsAndParseSchemas } from "./resolve";
import { renderSchema } from "./render";

import { WrapAbi } from "@polywrap/wrap-manifest-types-js";

export * from "./types";
export { renderSchema };

export interface ComposerOutput {
  schema?: string;
  abi?: WrapAbi;
}

export enum ComposerFilter {
  Schema = 1 << 0,
  Abi = 1 << 1,
  All = Schema | Abi,
}

export interface ComposerOptions {
  schema: SchemaFile;
  resolvers: SchemaResolvers;
  output: ComposerFilter;
}

export async function composeSchema(
  options: ComposerOptions
): Promise<ComposerOutput> {
  const abi = await resolveImports(options.schema, options.resolvers);

  // Forming our output structure for the caller
  const includeSchema = options.output & ComposerFilter.Schema;
  const includeAbi = options.output & ComposerFilter.Abi;

  return {
    schema: includeSchema ? renderSchema(abi, true) : undefined,
    abi: includeAbi ? abi : undefined,
  } as ComposerOutput;
}

export async function resolveImports(
  schema: SchemaFile,
  resolvers: SchemaResolvers
): Promise<WrapAbi> {
  return await resolveImportsAndParseSchemas(
    schema.schema,
    schema.absolutePath,
    resolvers
  );
}
