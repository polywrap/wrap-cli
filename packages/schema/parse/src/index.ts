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

  if (options.validate) {
    const validations =
      options && options.validators ? options.validators : validators;

    for (const validation of validations) {
      validation(astNode);
    }
  }

  let info = createTypeInfo();

  const extracts =
    options && options.extractors ? options.extractors : extractors;

  for (const extract of extracts) {
    extract(astNode, info);
  }

  info = performTransforms(info, finalizePropertyDef);

  if (options && options.transforms) {
    for (const transform of options.transforms) {
      info = performTransforms(info, transform);
    }
  }

  return info;
}
