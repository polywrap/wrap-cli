import {
  schemaKinds,
  SchemaKind,
  SchemaInfos,
  SchemaInfo,
  SchemaFile,
  SchemaResolvers,
} from "./types";
import { resolveEnvTypes, resolveImportsAndParseSchemas } from "./resolve";
import { renderSchema } from "./render";

import { TypeInfo, combineTypeInfo } from "@web3api/schema-parse";

export * from "./types";

export type ComposerOutput = Partial<SchemaInfos> &
  Required<{ combined: SchemaInfos["combined"] }>;

export enum ComposerFilter {
  Schema = 1 << 0,
  TypeInfo = 1 << 1,
  All = Schema | TypeInfo,
}

export interface ComposerOptions {
  schemas: Partial<Record<SchemaKind, SchemaFile>>;
  resolvers: SchemaResolvers;
  output: ComposerFilter;
}

export async function composeSchema(
  options: ComposerOptions
): Promise<ComposerOutput> {
  const { schemas, resolvers } = options;
  const typeInfos: Partial<Record<SchemaKind, TypeInfo>> = {};

  if (Object.keys(schemas).length === 0) {
    throw Error("No schema provided");
  }

  for (const kind of schemaKinds) {
    const schema = schemas[kind];

    if (schema === undefined) {
      continue;
    }

    typeInfos[kind] = await resolveImportsAndParseSchemas(
      schema.schema,
      schema.absolutePath,
      kind,
      resolvers
    );
    resolveEnvTypes(typeInfos[kind] as TypeInfo, kind);
  }

  // Forming our output structure for the caller
  const output: ComposerOutput = {
    combined: {},
  };
  const includeSchema = options.output & ComposerFilter.Schema;
  const includeTypeInfo = options.output & ComposerFilter.TypeInfo;
  const createSchemaInfo = (typeInfo: TypeInfo): SchemaInfo => ({
    schema: includeSchema ? renderSchema(typeInfo, true) : undefined,
    typeInfo: includeTypeInfo ? typeInfo : undefined,
  });

  for (const kind of schemaKinds) {
    const typeInfo = typeInfos[kind];
    if (typeInfo) {
      output[kind] = createSchemaInfo(typeInfo);
    }
  }

  const typeInfoKeys = Object.keys(typeInfos);

  if (typeInfoKeys.length > 1) {
    const combinedTypeInfo = combineTypeInfo(
      Object.values(typeInfos).filter((x) => x !== undefined) as TypeInfo[]
    );

    output.combined = createSchemaInfo(combinedTypeInfo);
  } else if (typeInfoKeys.length > 0) {
    output.combined = output[typeInfoKeys[0] as SchemaKind] as SchemaInfo;
  }

  return output;
}
