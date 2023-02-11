import { DocumentNode, parse } from "graphql";
import fs from "fs";
import { parseImportStatements } from "./parse";
import { fetchExternalSchema } from "./utils";

export const getImportedAbisRegistry = async (
  schema: string,
  schemaPath: string,
): Promise<Map<string, DocumentNode>> => {
  let importedAbiRegistry = new Map<string, DocumentNode>();

  const {
    externalImportStatements,
    localImportStatements
  } = parseImportStatements(schema, schemaPath);

  for await (const externalImportStatement of externalImportStatements) {
    const schemaString = await fetchExternalSchema(externalImportStatement.uri);
    importedAbiRegistry.set(externalImportStatement.uri, parse(schemaString));
  }

  for (const localImportStatement of localImportStatements) {
    const localSchemaFileSource = fs.readFileSync(localImportStatement.path, "utf8");
    importedAbiRegistry.set(localImportStatement.path, parse(localSchemaFileSource));
  }

  return importedAbiRegistry;
}
