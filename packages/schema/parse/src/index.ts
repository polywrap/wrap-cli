import { TypeInfo, createTypeInfo, combineTypeInfo } from "./typeInfo";
import { extractors, SchemaExtractor } from "./extract";
import { TypeInfoTransforms, performTransforms } from "./transform";
import { finalizePropertyDef } from "./transform/finalizePropertyDef";

import { parse } from "graphql";

export { TypeInfo, combineTypeInfo };
export * from "./transform";

interface ParserOptions {
  extractors?: SchemaExtractor[];
  transforms?: TypeInfoTransforms[];
}

export function parseSchema(schema: string, options?: ParserOptions): TypeInfo {
  const astNode = parse(schema);

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
