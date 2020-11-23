import {
  ComposerOptions,
  ComposerOutput
} from "./types";
import {
  resolveImports,
  addHeader
} from "./resolve";
import {
  template as schemaTemplate
} from "./templates/schema.mustache";

import Mustache from "mustache";
import {
  TypeInfo,
  combineTypeInfo
} from "@web3api/schema-parser/build";

// Remove mustache's built-in HTML escaping
Mustache.escape = (value) => value;

export {
  ComposerOptions,
  ComposerOutput
};

export function composeSchema(
  options: ComposerOptions
): ComposerOutput {
  const { schemas, resolvers } = options;
  const { query, mutation } = schemas;
  const results: {
    query?: { schema: string; typeInfo: TypeInfo }
    mutation?: { schema: string; typeInfo: TypeInfo }
  } = { }

  if (query && query.schema && query.absolutePath !== undefined) {
    results.query = resolveImports(
      query.schema, query.absolutePath, false, resolvers
    );
  }

  if (mutation && mutation.schema && mutation.absolutePath !== undefined) {
    results.mutation = resolveImports(
      mutation.schema, mutation.absolutePath, true, resolvers
    );
  }

  let result: ComposerOutput = {};

  if (results.query) {
    result.query = renderSchema(results.query.schema, results.query.typeInfo);
  }

  if (results.mutation) {
    result.mutation = renderSchema(results.mutation.schema, results.mutation.typeInfo);
  }

  if (results.query && results.mutation) {
    const typeInfo = combineTypeInfo([results.query.typeInfo, results.mutation.typeInfo]);
    result.combined = renderSchema(
      results.query.schema + results.mutation.schema, typeInfo
    );
  }

  return result;
}

function renderSchema(schema: string, typeInfo: TypeInfo) {
  return addHeader(
    Mustache.render(schemaTemplate, {
      schema,
      typeInfo
    })
  ).replace(/[\n]{2,}/gm, '\n\n'); // Remove needless whitespace
}
