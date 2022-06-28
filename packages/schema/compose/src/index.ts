import { SchemaFile, SchemaResolvers } from "./types";
import { resolveImportsAndParseSchemas } from "./resolve";
import { renderSchema } from "./render";
import { validateEnv } from "./env";

import { Abi, combineAbi } from "@polywrap/schema-parse";

export * from "./types";
export { renderSchema };

export interface ComposerOutput {
  schema?: string;
  abi?: Abi;
}

export enum ComposerFilter {
  Schema = 1 << 0,
  Abi = 1 << 1,
  All = Schema | Abi,
}

export interface ComposerOptions {
  schemas: SchemaFile[];
  resolvers: SchemaResolvers;
  output: ComposerFilter;
}

export async function composeSchema(
  options: ComposerOptions
): Promise<ComposerOutput> {
  const abis = await resolveImports(options.schemas, options.resolvers);

  const abi =
    abis.length === 1 ? abis[0] : combineAbi(abis);

  await validateEnv(abi);

  // Forming our output structure for the caller
  const includeSchema = options.output & ComposerFilter.Schema;
  const includeAbi = options.output & ComposerFilter.Abi;

  return {
    schema: includeSchema ? renderSchema(abi, true) : undefined,
    abi: includeAbi ? abi : undefined,
  };
}

export async function resolveImports(
  schemas: SchemaFile[],
  resolvers: SchemaResolvers
): Promise<Abi[]> {
  const abis: Abi[] = [];

  if (schemas.length === 0) {
    throw Error("No schema provided");
  }

  for (const schema of schemas) {
    abis.push(
      await resolveImportsAndParseSchemas(
        schema.schema,
        schema.absolutePath,
        resolvers
      )
    );
  }

  return abis;
}
