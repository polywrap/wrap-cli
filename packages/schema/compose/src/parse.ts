import { ExternalImport, LocalImport, SYNTAX_REFERENCE } from "./types";

import Path from "path";

export function parseExternalImports(
  imports: RegExpMatchArray[],
  mutation: boolean
): ExternalImport[] {
  const externalImports: ExternalImport[] = [];

  for (const importStatement of imports) {
    if (importStatement.length !== 4) {
      throw Error(
        `Invalid external import statement found:\n${importStatement[0]}\n` +
          `Please use the following syntax...\n${SYNTAX_REFERENCE}`
      );
    }

    const importedTypes = importStatement[1]
      .split(",")
      .map((str) => str.replace(/\s+/g, "")) // Trim all whitespace
      .filter(Boolean); // Remove empty strings

    // Make sure the developer does not try to import a dependencies dependency
    const index = importedTypes.findIndex((str) => str.indexOf("_") > -1);
    if (index > -1) {
      throw Error(
        `Importing a dependency's imported type is forbidden. Only import types that do not have an '_' in the typename.`
      );
    }

    const namespace = importStatement[2];
    const uri = importStatement[3];

    if (!mutation && importedTypes.indexOf("Mutation") > -1) {
      throw Error(
        `Query modules cannot import Mutations, write operations are prohibited.\nSee import statement for namespace "${namespace}" at uri "${uri}"`
      );
    }

    externalImports.push({
      importedTypes,
      namespace,
      uri,
    });
  }

  // Make sure namespaces are unique
  const namespaceCounts = (imports: ExternalImport[]) =>
    imports.reduce(
      (a: Record<string, number>, b: ExternalImport) => ({
        ...a,
        [b.namespace]: (a[b.namespace] || 0) + 1,
      }),
      {}
    );

  const namespaceDuplicates = (imports: ExternalImport[]) => {
    const counts = namespaceCounts(imports);
    return Object.keys(counts).filter((a) => counts[a] > 1);
  };

  const duplicateNamespaces = namespaceDuplicates(externalImports);
  if (duplicateNamespaces.length > 0) {
    throw Error(`Duplicate namespaces found: ${duplicateNamespaces}`);
  }

  // Make sure all uris have the same namespace
  const uriToNamespace: Record<string, string> = {};
  for (const ext of externalImports) {
    if (uriToNamespace[ext.uri]) {
      if (uriToNamespace[ext.uri] !== ext.namespace) {
        throw Error(
          `Imports from a single URI must be imported into the same namespace.\nURI: ${
            ext.uri
          }\nNamespace 1: ${ext.namespace}\nNamespace 2: ${
            uriToNamespace[ext.uri]
          }`
        );
      }
    } else {
      uriToNamespace[ext.uri] = ext.namespace;
    }
  }

  return externalImports;
}

export function parseLocalImports(
  imports: RegExpMatchArray[],
  schemaPath: string
): LocalImport[] {
  const localImports: LocalImport[] = [];

  for (const importStatement of imports) {
    if (importStatement.length !== 3) {
      throw Error(
        `Invalid external import statement found:\n${importStatement[0]}\n` +
          `Please use the following syntax...\n${SYNTAX_REFERENCE}`
      );
    }

    const importTypes = importStatement[1]
      .split(",")
      .map((str) => str.replace(/\s+/g, "")) // Trim all whitespace
      .filter(Boolean); // Remove empty strings
    const importPath = importStatement[2];
    const path = Path.join(Path.dirname(schemaPath), importPath);

    // Make sure the developer does not try to import a dependencies dependency
    const index = importTypes.findIndex((str) => str.indexOf("_") > -1);
    if (index > -1) {
      throw Error(
        `User defined types with '_' in their name are forbidden. This is used for Web3API import namespacing.`
      );
    }

    localImports.push({
      objectTypes: importTypes,
      path,
    });
  }

  // Make sure types are unique
  const importTypeCount = (importTypes: string[]) =>
    importTypes.reduce(
      (a: Record<string, number>, b: string) => ({
        ...a,
        [b]: (a[b] || 0) + 1,
      }),
      {}
    );

  const importTypeDuplicates = (imports: LocalImport[]) => {
    const importTypes: string[] = [];
    imports.forEach((i) => importTypes.push(...i.objectTypes));
    const counts = importTypeCount(importTypes);
    return Object.keys(counts).filter((a) => counts[a] > 1);
  };

  const duplicateImportTypes = importTypeDuplicates(localImports);
  if (duplicateImportTypes.length > 0) {
    throw Error(`Duplicate type found: ${duplicateImportTypes}`);
  }

  return localImports;
}
