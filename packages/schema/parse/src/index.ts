import { TypeInfo, createTypeInfo } from "./typeInfo";
import { extractors, SchemaExtractor } from "./extract";
import { TypeInfoTransforms, performTransforms } from "./transform";
import { finalizePropertyDef } from "./transform/finalizePropertyDef";
import { validators, SchemaValidator } from "./validate";
import { Blackboard } from "./extract/Blackboard";

import { parse } from "graphql";

export * from "./typeInfo";
export * from "./transform";
export * from "./header";

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

  // Create a blackboard for shared metadata
  const blackboard = new Blackboard(astNode);

  // Extract & Build TypeInfo
  let info = createTypeInfo();
  const extracts = options.extractors || extractors;

  for (const extract of extracts) {
    extract(astNode, info, blackboard);
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
