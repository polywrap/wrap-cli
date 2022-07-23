import { createAbi } from "./abi";
import { extractors, SchemaExtractorBuilder } from "./extract";
import { AbiTransforms, transformAbi, finalizePropertyDef } from "./transform";
import { validators } from "./validate";
import { SchemaValidatorBuilder } from "./validate";

import { DocumentNode, parse, visit, visitInParallel } from "graphql";
import { WrapAbi } from "@polywrap/wrap-manifest-types-js";

export * from "./abi";
export * from "./transform";
export * from "./header";

interface ParserOptions {
  extractors?: SchemaExtractorBuilder[];
  transforms?: AbiTransforms[];
  validators?: SchemaValidatorBuilder[];
  noValidate?: boolean;
}

export function parseSchema(
  schema: string,
  options: ParserOptions = {}
): WrapAbi {
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
  abi: WrapAbi,
  extractors: SchemaExtractorBuilder[]
) => {
  const allVisitors = extractors.map((getVisitor) => getVisitor(abi));

  visit(astNode, visitInParallel(allVisitors));
};
