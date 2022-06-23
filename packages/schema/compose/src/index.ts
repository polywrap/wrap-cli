import { SchemaFile, SchemaResolvers } from "./types";
import { resolveImportsAndParseSchemas } from "./resolve";
import { renderSchema } from "./render";
import { validateEnv } from "./env";

import { TypeInfo, combineTypeInfo } from "@polywrap/schema-parse";

export * from "./types";
export { renderSchema };

export interface ComposerOutput {
  schema?: string;
  typeInfo?: TypeInfo;
}

export enum ComposerFilter {
  Schema = 1 << 0,
  TypeInfo = 1 << 1,
  All = Schema | TypeInfo,
}

export interface ComposerOptions {
  schemas: SchemaFile[];
  resolvers: SchemaResolvers;
  output: ComposerFilter;
}

export async function composeSchema(
  options: ComposerOptions
): Promise<ComposerOutput> {
  const typeInfos = await resolveImports(options.schemas, options.resolvers);

  const typeInfo =
    typeInfos.length === 1 ? typeInfos[0] : combineTypeInfo(typeInfos);

  await validateEnv(typeInfo);

  // Forming our output structure for the caller
  const includeSchema = options.output & ComposerFilter.Schema;
  const includeTypeInfo = options.output & ComposerFilter.TypeInfo;

  return {
    schema: includeSchema ? renderSchema(typeInfo, true) : undefined,
    typeInfo: includeTypeInfo ? typeInfo : undefined,
  };
}

export async function resolveImports(
  schemas: SchemaFile[],
  resolvers: SchemaResolvers
): Promise<TypeInfo[]> {
  const typeInfos: TypeInfo[] = [];

  if (schemas.length === 0) {
    throw Error("No schema provided");
  }

  for (const schema of schemas) {
    typeInfos.push(
      await resolveImportsAndParseSchemas(
        schema.schema,
        schema.absolutePath,
        resolvers
      )
    );
  }

  return typeInfos;
}
