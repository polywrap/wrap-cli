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

export interface ComposerOutput {
  query?: string;
  mutation?: string;
  combined?: string;
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
    result.query = renderSchema(results.query, true);
  }

  if (results.mutation) {
    result.mutation = renderSchema(results.mutation, true);
  }

  if (results.query && results.mutation) {
    const typeInfo = combineTypeInfo([
      results.query,
      results.mutation,
    ]);

    result.combined = renderSchema(typeInfo, true);
  } else if (results.query) {
    result.combined = renderSchema(results.query, true);
  } else if (results.mutation) {
    result.combined = renderSchema(results.mutation, true);
  }

  return result;
}
