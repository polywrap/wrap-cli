import { createAbi, isEnvType, isModuleType } from "./abi";
import { AbiTransforms, transformAbi, finalizePropertyDef } from "./transform";
import { validators, SchemaValidatorBuilder } from "./validate";

import { DocumentNode, parse, visit, visitInParallel } from "graphql";
import { Abi, UniqueDefKind } from "./definitions";
import { ExternalVisitorBuilder, VisitorBuilder } from "./extract/types";
import { ObjectVisitorBuilder } from "./extract";
import { EnvVisitorBuilder } from "./extract";
import { EnumVisitorBuilder } from "./extract";
import { ModuleVisitorBuilder } from "./extract";

export * from "./abi";
export * from "./transform";
export * from "./validate";
export * from "./header";

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

const extractUniqueDefinitionNames = (document: DocumentNode): Map<string, UniqueDefKind> => {
  const uniqueDefs = new Map<string, UniqueDefKind>();

  visit(document, {
    ObjectTypeDefinition: (node) => {
      const name = node.name.value;

      if (!isModuleType(name) && !isEnvType(name)) {
        uniqueDefs.set(name, "Object")
      }
    },
    EnumTypeDefinition: (node) => {
      uniqueDefs.set(node.name.value, "Enum")
    }
  });

  return uniqueDefs;
}

export function parseSchema(
  schema: string,
  options: ParserOptions = {}
): Abi {
  const astNode = parse(schema);
  const uniqueDefs = extractUniqueDefinitionNames(astNode);
  const defaultExtractors: VisitorBuilder[] = [
    new ObjectVisitorBuilder(uniqueDefs),
    new EnvVisitorBuilder(uniqueDefs),
    new EnumVisitorBuilder(),
    new ModuleVisitorBuilder(uniqueDefs)
  ]

  // Validate GraphQL Schema
  if (!options.noValidate) {
    const validates = options.validators || validators;
    validate(astNode, validates);
  }

  // Extract & Build Abi
  let info = createAbi();

  const extracts = options.extractors?.map(extractorBuilder => extractorBuilder(info, uniqueDefs)) ?? defaultExtractors.map(e => e.build(info));
  extract(astNode, info, extracts);

  // Finalize & Transform Abi
  info = transformAbi(info, finalizePropertyDef(info));

  if (options && options.transforms) {
    for (const transform of options.transforms) {
      info = transformAbi(info, transform);
    }
  }

  return {
    version: "0.1",
    objectTypes: info.objectTypes?.length ? info.objectTypes : undefined,
    moduleType: info.moduleType ? info.moduleType : undefined,
    enumTypes: info.enumTypes?.length ? info.enumTypes : undefined,
    interfaceTypes: info.interfaceTypes?.length
      ? info.interfaceTypes
      : undefined,
    importedObjectTypes: info.importedObjectTypes?.length
      ? info.importedObjectTypes
      : undefined,
    importedModuleTypes: info.importedModuleTypes?.length
      ? info.importedModuleTypes
      : undefined,
    importedEnumTypes: info.importedEnumTypes?.length
      ? info.importedEnumTypes
      : undefined,
    importedEnvTypes: info.importedEnvTypes?.length
      ? info.importedEnvTypes
      : undefined,
    envType: info.envType ? info.envType : undefined,
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
  abi: WrapAbi,
  extractors: SchemaExtractorBuilder[]
) => {
  const allVisitors = extractors.map((getVisitor) => getVisitor(abi));

  visit(astNode, visitInParallel(allVisitors));
};
