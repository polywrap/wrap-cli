import { Abi } from "./definitions";
import { ParserOptions, SchemaParser } from "./types";

export * from "./abi";
export * from "./types";

export const parseSchemaAndImports = async (schema: string, schemaPath: string, parser: SchemaParser, options: ParserOptions = {}): Promise<{ abi: Abi, imports: Map<string, Abi> }> => {
  throw new Error("Unimplemented")
  
  // const importsRegistry = await parser.getImportedSchemasTable(schema, schemaPath);
  // let allUniqueDefinitions = new Map<string, UniqueDefKind>();
  
  // for await (const importedAbi of importsRegistry.values()) {
  //   const importedAbiUniqueDefs = await parser.getUniqueDefinitionsTable(importedAbi);
  //   allUniqueDefinitions = new Map([...allUniqueDefinitions, ...importedAbiUniqueDefs]);
  // }

  // const importedAbis = new Map<string, Abi>();

  // for await (const [importPath, importedSchemaString] of importsRegistry.entries()) {
  //   const importedAbi = await parser.parse(importedSchemaString, allUniqueDefinitions);
  //   importedAbis.set(importPath, importedAbi);
  // }

  // // TODO: should this happen before or after linking?
  // // TODO: where does validation happen?
  // let abi = await parser.parse(schema, allUniqueDefinitions);

  // return {
  //   abi,
  //   imports: importedAbis
  // }
}

