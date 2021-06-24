import { TypeInfo, createTypeInfo } from "./typeInfo";
import { extractors, SchemaExtractor } from "./extract";
import { TypeInfoTransforms, transformTypeInfo } from "./transform";
import { finalizePropertyDef } from "./transform/finalizePropertyDef";
import { validators, SchemaValidator } from "./validate";
import { Blackboard } from "./extract/Blackboard";
import { aggregateVisitors } from "./aggregateVisitors";

import { DocumentNode, parse, visit } from "graphql";

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
    validate(astNode, validates);
  }

  // Create a blackboard for shared metadata
  const blackboard = new Blackboard(astNode);

  // Extract & Build TypeInfo
  let info = createTypeInfo();

  const extracts = options.extractors || extractors;
  extract(astNode, info, blackboard, extracts);

  // Finalize & Transform TypeInfo
  info = transformTypeInfo(info, finalizePropertyDef);

  if (options && options.transforms) {
    for (const transform of options.transforms) {
      info = transformTypeInfo(info, transform);
    }
  }

  return info;
}

const validate = (
  astNode: DocumentNode,
  validators: SchemaValidator[],
) => {
  
  const allValidators = validators.map(getValidator => getValidator());
  const allVisitors = allValidators.map(x => x.visitor);
  const allDisplayValidationMessages = allValidators
    .map(x => x.displayValidationMessagesIfExist)
    .filter(x => x);


  visit(astNode, aggregateVisitors(allVisitors));

  for(const displayValidationMessagesIfExist of allDisplayValidationMessages) {
    displayValidationMessagesIfExist!(astNode);
  }
};

const extract = (
  astNode: DocumentNode,
  typeInfo: TypeInfo,
  blackboard: Blackboard,
  extractors: SchemaExtractor[],
) => {
  const allVisitors = extractors.map(getVisitor => getVisitor(typeInfo, blackboard));

  visit(astNode, aggregateVisitors(allVisitors));
};
