import { SchemaFile, SchemaResolvers } from "./types";
import { resolveImports, addHeader } from "./resolve";
import { template as schemaTemplate } from "./templates/schema.mustache";

import Mustache from "mustache";
import {
  TypeInfo,
  combineTypeInfo,
  addFirstLast,
  toGraphQLType,
  performTransforms,
} from "@web3api/schema-parse";

// Remove mustache's built-in HTML escaping
Mustache.escape = (value) => value;

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
    query?: { schema: string; typeInfo: TypeInfo };
    mutation?: { schema: string; typeInfo: TypeInfo };
  } = {};

  if (query && query.schema && query.absolutePath !== undefined) {
    results.query = await resolveImports(
      query.schema,
      query.absolutePath,
      false,
      resolvers
    );
  }

  if (mutation && mutation.schema && mutation.absolutePath !== undefined) {
    results.mutation = await resolveImports(
      mutation.schema,
      mutation.absolutePath,
      true,
      resolvers
    );
  }

  const result: ComposerOutput = {};

  if (results.query) {
    result.query = renderSchema(results.query.schema, results.query.typeInfo);
  }

  if (results.mutation) {
    result.mutation = renderSchema(
      results.mutation.schema,
      results.mutation.typeInfo
    );
  }

  if (results.query && results.mutation) {
    const typeInfo = combineTypeInfo([
      results.query.typeInfo,
      results.mutation.typeInfo,
    ]);
    result.combined = renderSchema(
      results.query.schema + results.mutation.schema,
      typeInfo
    );
  }

  return result;
}

function renderSchema(schema: string, typeInfo: TypeInfo) {
  // Prepare the TypeInfo for the renderer
  typeInfo = performTransforms(typeInfo, addFirstLast);
  typeInfo = performTransforms(typeInfo, toGraphQLType);

  return addHeader(
    Mustache.render(schemaTemplate, {
      schema,
      typeInfo,
    })
  ).replace(/[\n]{2,}/gm, "\n\n"); // Remove needless whitespace
}
