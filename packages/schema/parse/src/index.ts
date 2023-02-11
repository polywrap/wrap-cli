import { createAbi } from "./abi";
import { AbiTransforms, transformAbi } from "./transform";
import { validators, SchemaValidatorBuilder } from "./validate";

import { ASTVisitor, DocumentNode, parse, visit, visitInParallel } from "graphql";
import { Abi, UniqueDefKind } from "./definitions";
import { ExternalVisitorBuilder, VisitorBuilder } from "./extract/types";
import { ObjectVisitorBuilder } from "./extract";
import { EnumVisitorBuilder } from "./extract";
import { FunctionsVisitorBuilder } from "./extract";
import { SchemaParser } from "./types";

export * from "./abi";
export * from "./transform";
export * from "./validate";
export * from "./header";
export * from "./types";

interface ParserOptions {
  // Disable schema validation
  noValidate?: boolean;
  // Use custom validators
  validators?: SchemaValidatorBuilder[];
  // Use custom extractors
  extractors?: ExternalVisitorBuilder[];
  // Use custom transformations
  transforms?: AbiTransforms[];
}

export const parseSchemaAndImports = async (schema: string, schemaPath: string, parser: SchemaParser): Promise<{ abi: Abi, imports: Map<string, Abi> }> => {
  const importsRegistry = await parser.getImportedSchemasTable(schema, schemaPath);
  let allUniqueDefinitions = new Map<string, UniqueDefKind>();
  
  for (const importedAbi of importsRegistry.values()) {
    allUniqueDefinitions = new Map([...allUniqueDefinitions, ...parser.getUniqueDefinitionsTable(importedAbi)]);
  }

  const importedAbis = new Map<string, Abi>();

  for (const [importPath, importedAbi] of importsRegistry.entries()) {
    importedAbis.set(importPath, parser.parse(importedAbi, allUniqueDefinitions));
  }

  return {
    abi: parser.parse(schema, allUniqueDefinitions),
    imports: importedAbis
  }
}

function transformSchemaToAbi(
  astNode: DocumentNode,
  uniqueDefinitions: Map<string, UniqueDefKind>,
  options: ParserOptions = {}
): Abi {
  
  const defaultExtractors: VisitorBuilder[] = [
    new ObjectVisitorBuilder(uniqueDefinitions),
    new EnumVisitorBuilder(),
    new FunctionsVisitorBuilder(uniqueDefinitions)
  ]

  // Validate GraphQL Schema
  if (!options.noValidate) {
    const validates = options.validators || validators;
    validate(astNode, validates);
  }

  // Extract & Build Abi
  let info = createAbi();

  const extracts = options.extractors?.map(extractorBuilder => extractorBuilder(info, uniqueDefinitions)) ?? defaultExtractors.map(e => e.build(info));
  extract(astNode, extracts);

  if (options && options.transforms) {
    for (const transform of options.transforms) {
      info = transformAbi(info, transform);
    }
  }

  return {
    version: "0.2",
    objects: info.objects?.length ? info.objects : undefined,
    functions: info.functions?.length ? info.functions : undefined,
    enums: info.enums?.length ? info.enums : undefined,
    imports: info.imports?.length ? info.imports : undefined,
  };
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
  extractors: ASTVisitor[]
) => {
  visit(astNode, visitInParallel(extractors));
};
