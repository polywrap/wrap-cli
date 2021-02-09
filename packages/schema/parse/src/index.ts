import { TypeInfo, createTypeInfo } from "./typeInfo";
import { extractors, SchemaExtractor } from "./extract";
import { TypeInfoTransforms, performTransforms } from "./transform";
import { finalizePropertyDef } from "./transform/finalizePropertyDef";
import { validators, SchemaValidator } from "./validate";
import { extractTypeDefinitions } from "./extract/type-definitions";

import { parse } from "graphql";

export * from "./typeInfo";
export * from "./transform";

interface ParserOptions {
  extractors?: SchemaExtractor[];
  transforms?: TypeInfoTransforms[];
  validators?: SchemaValidator[];
  noValidate?: boolean;
}

export function parseSchema(
  schema: string,
  options: ParserOptions = {}
): TypeInfo {
  const astNode = parse(schema);

  // Validate GraphQL Schema
  if (!options.noValidate) {
    const validates = options.validators || validators;
    const errors: Error[] = [];

    for (const validate of validates) {
      try {
        validate(astNode);
      } catch (e) {
        errors.push(e);
      }
    }

    if (errors.length) {
      throw errors;
    }
  }

  // Extract & Build TypeInfo
  let info = createTypeInfo();
  const extracts = options.extractors || extractors;
  const typeDefinitions = extractTypeDefinitions(astNode);

  for (const extract of extracts) {
    extract(astNode, info, typeDefinitions);
  }

  // Finalize & Transform TypeInfo
  info = performTransforms(info, finalizePropertyDef);

  if (options && options.transforms) {
    for (const transform of options.transforms) {
      info = performTransforms(info, transform);
    }
  }

  return info;
}
