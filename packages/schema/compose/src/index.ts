import { SchemaFile, SchemaResolvers } from "./types";
import { resolveImportsAndParseSchemas } from "./resolve";
import { renderSchema } from "./render";

import {
  TypeInfo,
  combineTypeInfo,
} from "@web3api/schema-parse";

export interface ComposerOptions {
  schemas: {
    query?: SchemaFile;
    mutation?: SchemaFile;
  };
  resolvers: SchemaResolvers;
}

export interface SchemaInfo {
  schema: string;
  typeInfo: TypeInfo;
}

export interface ComposerOutput {
  query?: SchemaInfo;
  mutation?: SchemaInfo;
  combined?: SchemaInfo;
}

export async function composeSchema(
  options: ComposerOptions
): Promise<ComposerOutput> {
  const { schemas, resolvers } = options;
  const { query, mutation } = schemas;
  const results: {
    query?: TypeInfo;
    mutation?: TypeInfo;
  } = {};

  if (query && query.schema) {
    results.query = await resolveImportsAndParseSchemas(
      query.schema,
      query.absolutePath,
      false,
      resolvers
    );
  }

  if (mutation && mutation.schema) {
    results.mutation = await resolveImportsAndParseSchemas(
      mutation.schema,
      mutation.absolutePath,
      true,
      resolvers
    );
  }

  const result: ComposerOutput = {};

  if (results.query) {
    result.query = {
      schema: renderSchema(results.query, true),
      typeInfo: results.query
    };
  }

  if (results.mutation) {
    result.mutation = {
      schema: renderSchema(results.mutation, true),
      typeInfo: results.mutation
    };
  }

  if (results.query && results.mutation) {
    const typeInfo = combineTypeInfo([
      results.query,
      results.mutation,
    ]);

    result.combined = {
      schema: renderSchema(typeInfo, true),
      typeInfo
    };
  } else if (results.query) {
    result.combined = {
      schema: renderSchema(results.query, true),
      typeInfo: results.query
    };
  } else if (results.mutation) {
    result.combined = {
      schema: renderSchema(results.mutation, true),
      typeInfo: results.mutation
    };
  }

  return result;
}
