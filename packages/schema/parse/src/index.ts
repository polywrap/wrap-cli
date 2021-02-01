import { TypeInfo, createTypeInfo } from "./typeInfo";
import { extractors, SchemaExtractor } from "./extract";
import { TypeInfoTransforms, performTransforms } from "./transform";
import { finalizePropertyDef } from "./transform/finalizePropertyDef";
import { validators, SchemaValidator } from "./validate";

import { parse } from "graphql";

export * from "./typeInfo";
export * from "./transform";

interface ParserOptions {
  extractors?: SchemaExtractor[];
  transforms?: TypeInfoTransforms[];
  validators?: SchemaValidator[];
  validate?: boolean;
}

export function parseSchema(
  schema: string,
  options: ParserOptions = { validate: true }
): TypeInfo {
  const astNode = parse(schema);

  // Validate GraphQL Schema
  if (options.validate) {
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

  for (const extract of extracts) {
    extract(astNode, info);
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
