import { TypeInfo, createTypeInfo } from "./typeInfo";
import { extractors, SchemaExtractor } from "./extract";
import { TypeInfoTransforms, performTransforms } from "./transform";
import { finalizePropertyDef } from "./transform/finalizePropertyDef";

import { printSchemaWithDirectives } from "graphql-tools";
import { parse, buildSchema } from "graphql";

export * from "./transform";

interface ParserOptions {
  extractors?: SchemaExtractor[];
  transforms?: TypeInfoTransforms[];
}

export function parseSchema(
  schema: string,
  options?: ParserOptions
): TypeInfo {

  const builtSchema = buildSchema(schema);
  const printedSchema = printSchemaWithDirectives(builtSchema);
  const astNode = parse(printedSchema);

  let info = createTypeInfo();

  let extracts = options && options.extractors ?
    options.extractors :
    extractors;

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
