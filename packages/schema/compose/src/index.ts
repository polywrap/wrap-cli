import { SchemaFile, SchemaResolvers } from "./types";
import {
  resolveEnviromentTypes,
  resolveImportsAndParseSchemas,
} from "./resolve";
import { renderSchema } from "./render";

import {
  TypeInfo,
  combineTypeInfo,
  EnvironmentType,
} from "@web3api/schema-parse";

export * from "./types";

export interface SchemaInfo {
  schema?: string;
  typeInfo?: TypeInfo;
}

export interface ComposerOutput {
  query?: SchemaInfo;
  mutation?: SchemaInfo;
  combined: SchemaInfo;
}

export enum ComposerFilter {
  Schema = 1 << 0,
  TypeInfo = 1 << 1,
  All = Schema | TypeInfo,
}

export interface ComposerOptions {
  schemas: {
    query?: SchemaFile;
    mutation?: SchemaFile;
  };
  resolvers: SchemaResolvers;
  output: ComposerFilter;
}

export async function composeSchema(
  options: ComposerOptions
): Promise<ComposerOutput> {
  const { schemas, resolvers } = options;
  const { query, mutation } = schemas;
  const typeInfos: {
    query?: TypeInfo;
    mutation?: TypeInfo;
  } = {};
  if (query && query.schema) {
    typeInfos.query = await resolveImportsAndParseSchemas(
      query.schema,
      query.absolutePath,
      false,
      resolvers
    );
    resolveEnviromentTypes(
      typeInfos.query,
      EnvironmentType.QueryEnvType,
      typeInfos.query.objectTypes.find(
        (type) => type.type === EnvironmentType.QueryEnvType
      )
    );
  }

  if (mutation && mutation.schema) {
    typeInfos.mutation = await resolveImportsAndParseSchemas(
      mutation.schema,
      mutation.absolutePath,
      true,
      resolvers
    );
    resolveEnviromentTypes(
      typeInfos.mutation,
      EnvironmentType.MutationEnvType,
      typeInfos.mutation.objectTypes.find(
        (type) => type.type === EnvironmentType.MutationEnvType
      )
    );
  }

  const output: ComposerOutput = {
    combined: {},
  };
  const includeSchema = options.output & ComposerFilter.Schema;
  const includeTypeInfo = options.output & ComposerFilter.TypeInfo;
  const createSchemaInfo = (typeInfo: TypeInfo): SchemaInfo => ({
    schema: includeSchema ? renderSchema(typeInfo, true) : undefined,
    typeInfo: includeTypeInfo ? typeInfo : undefined,
  });

  if (typeInfos.query) {
    output.query = createSchemaInfo(typeInfos.query);
  }

  if (typeInfos.mutation) {
    output.mutation = createSchemaInfo(typeInfos.mutation);
  }

  if (typeInfos.query && typeInfos.mutation) {
    const combinedTypeInfo = combineTypeInfo([
      typeInfos.query,
      typeInfos.mutation,
    ]);

    output.combined = createSchemaInfo(combinedTypeInfo);
  } else if (typeInfos.query && output.query) {
    output.combined = output.query;
  } else if (typeInfos.mutation && output.mutation) {
    output.combined = output.mutation;
  }

  return output;
}
