import { Abi, createAbi } from "./abi";
import { extractors, SchemaExtractorBuilder } from "./extract";
import { AbiTransforms, transformAbi } from "./transform";
import { finalizePropertyDef } from "./transform/finalizePropertyDef";
import { validators } from "./validate";
import { SchemaValidatorBuilder } from "./validate";

import { DocumentNode, parse, visit, visitInParallel } from "graphql";

export * from "./abi";
export * from "./transform";
export * from "./header";

interface ParserOptions {
  // Disable schema validation
  noValidate?: boolean;
  // Use custom validators
  validators?: SchemaValidatorBuilder[];
  // Use custom extractors
  extractors?: SchemaExtractorBuilder[];
  // Use custom transformations
  transforms?: AbiTransforms[];
}

export function parseSchema(schema: string, options: ParserOptions = {}): Abi {
  const astNode = parse(schema);

  // Validate GraphQL Schema
  if (!options.noValidate) {
    const validates = options.validators || validators;
    validate(astNode, validates);
  }

  // Extract & Build Abi
  let info = createAbi();

  const extracts = options.extractors || extractors;
  extract(astNode, info, extracts);

  // Finalize & Transform Abi
  info = transformAbi(info, finalizePropertyDef(info));

  if (options && options.transforms) {
    for (const transform of options.transforms) {
      info = transformAbi(info, transform);
    }
  }

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
  abi: Abi,
  extractors: SchemaExtractorBuilder[]
) => {
  const allVisitors = extractors.map((getVisitor) => getVisitor(abi));

  visit(astNode, visitInParallel(allVisitors));
};
