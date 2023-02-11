import { AbiTransforms, transformAbi } from "./transform";

import { Abi, UniqueDefKind } from "./definitions";
import { SchemaParser } from "./types";

export * from "./abi";
export * from "./transform";
export * from "./header";
export * from "./types";

interface ParserOptions {
  // Disable schema validation
  noValidate?: boolean;
  // Use custom transformations
  transforms?: AbiTransforms[];
}

export const parseSchemaAndImports = async (schema: string, schemaPath: string, parser: SchemaParser, options: ParserOptions = {}): Promise<{ abi: Abi, imports: Map<string, Abi> }> => {
  const importsRegistry = await parser.getImportedSchemasTable(schema, schemaPath);
  let allUniqueDefinitions = new Map<string, UniqueDefKind>();
  
  for (const importedAbi of importsRegistry.values()) {
    allUniqueDefinitions = new Map([...allUniqueDefinitions, ...parser.getUniqueDefinitionsTable(importedAbi)]);
  }

  const importedAbis = new Map<string, Abi>();

  for (const [importPath, importedAbi] of importsRegistry.entries()) {
    importedAbis.set(importPath, parser.parse(importedAbi, allUniqueDefinitions));
  }

  // TODO: should this happen before or after linking?
  // TODO: where does validation happen?
  let abi = parser.parse(schema, allUniqueDefinitions);

  if (options && options.transforms) {
    for (const transform of options.transforms) {
      abi = transformAbi(abi, transform);
    }
  }

  return {
    abi,
    imports: importedAbis
  }
}

