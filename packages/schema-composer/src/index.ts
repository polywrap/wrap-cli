import {
  ComposerOptions,
  ComposerOutput
} from "./types";
import { resolveImports } from "./resolve";

export {
  ComposerOptions,
  ComposerOutput
};

export function composeSchema(
  options: ComposerOptions
): ComposerOutput {
  const { schemas, resolvers } = options;
  let querySchema = schemas.query?.schema;
  const queryPath = schemas.query?.absolutePath;
  let mutationSchema = schemas.mutation?.schema;
  const mutationPath = schemas.mutation?.absolutePath;

  if (querySchema && queryPath !== undefined) {
    querySchema = resolveImports(
      querySchema, queryPath, false, resolvers
    );
  }

  // TODO: inject dummy query type?
  if (mutationSchema && mutationPath !== undefined) {
    mutationSchema = resolveImports(
      mutationSchema, mutationPath, true, resolvers
    );
  }

  let combined: string | undefined;

  if (mutationSchema && querySchema) {
    // TODO:
    // combine mutation & query
    // remove empty query type
  } else if (mutationSchema) {
    combined = mutationSchema;
  } else if (querySchema) {
    combined = querySchema;
  }

  return {
    query: querySchema,
    mutation: mutationSchema,
    combined: combined
  };
}
