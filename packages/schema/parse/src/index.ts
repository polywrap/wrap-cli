import { TypeInfo, createTypeInfo } from "./typeInfo";
import { extractors, SchemaExtractorBuilder } from "./extract";
import { TypeInfoTransforms, transformTypeInfo } from "./transform";
import { finalizePropertyDef } from "./transform/finalizePropertyDef";
import { validators } from "./validate";
import { validateEnv } from "./validate/env";
import { SchemaValidatorBuilder } from "./validate";

import { DocumentNode, parse, visit, visitInParallel } from "graphql";

export * from "./typeInfo";
export * from "./transform";
export * from "./header";

interface ParserOptions {
  extractors?: SchemaExtractorBuilder[];
  transforms?: TypeInfoTransforms[];
  validators?: SchemaValidatorBuilder[];
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
    validate(astNode, validates);
  }

  // Extract & Build TypeInfo
  let info = createTypeInfo();

  const extracts = options.extractors || extractors;
  extract(astNode, info, extracts);

  // Finalize & Transform TypeInfo
  info = transformTypeInfo(info, finalizePropertyDef(info));

  if (options && options.transforms) {
    for (const transform of options.transforms) {
      info = transformTypeInfo(info, transform);
    }
  }

  validateEnv(info);

  return info;
}

const validate = (
  astNode: DocumentNode,
  validators: SchemaValidatorBuilder[]
) => {
  const allValidators = validators.map((getValidator) => getValidator());
  const allVisitors = allValidators.map((x) => x.visitor);
  const allCleanup = allValidators.map((x) => x.cleanup);

  visit(astNode, visitInParallel(allVisitors));

  for (const cleanup of allCleanup) {
    if (cleanup) {
      cleanup(astNode);
    }
  }
};

const extract = (
  astNode: DocumentNode,
  typeInfo: TypeInfo,
  extractors: SchemaExtractorBuilder[]
) => {
  const allVisitors = extractors.map((getVisitor) => getVisitor(typeInfo));

  visit(astNode, visitInParallel(allVisitors));
};
