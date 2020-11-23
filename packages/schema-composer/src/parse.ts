import {
  ExternalImport,
  LocalImport,
  SYNTAX_REFERENCE
} from "./types";

import Path from "path";

export function parseExternalImports(imports: RegExpMatchArray[], mutation: boolean): ExternalImport[] {
  const externalImports: ExternalImport[] = [];

  for (const importStatement of imports) {

    if (importStatement.length !== 4) {
      throw Error(
        `Invalid external import statement found:\n${importStatement[0]}\n` +
        `Please use the following syntax...\n${SYNTAX_REFERENCE}`
      );
    }

    const importedTypes = importStatement[1].split(',')
      .map((str) => str.replace(/\s+/g, "")) // Trim all whitespace
      .filter(Boolean); // Remove empty strings

    // Make sure the developer does not try to import a dependencies dependency
    const index = importedTypes.findIndex((str) => str.indexOf('_') > -1);
    if (index > -1) {
      throw Error(`Importing a dependency's imported type is forbidden. Only import types that do not have an '_' in the typename.`);
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
      uri
    });
  }

  // Make sure namespaces are unique
  const namespaceCounts = (imports: ExternalImport[]) =>
    imports.reduce((a: any, b: ExternalImport) => ({ ...a,
      [b.namespace]: (a[b.namespace] || 0) + 1
    }), {});

  const namespaceDuplicates = (imports: ExternalImport[]) => {
    const counts = namespaceCounts(imports);
    return Object.keys(counts)
      .filter((a) => counts[a] > 1);
  }

  const duplicateNamespaces = namespaceDuplicates(externalImports);
  if (duplicateNamespaces.length > 0) {
    throw Error(`Duplicate namespaces found: ${duplicateNamespaces}`);
  }

  return externalImports;
}

export function parseLocalImports(imports: RegExpMatchArray[], schemaPath: string): LocalImport[] {
  const localImports: LocalImport[] = [];

  for (const importStatement of imports) {

    if (importStatement.length !== 3) {
      throw Error(
        `Invalid external import statement found:\n${importStatement[0]}\n` +
        `Please use the following syntax...\n${SYNTAX_REFERENCE}`
      );
    }

    const userTypes = importStatement[1].split(',')
      .map((str) => str.replace(/\s+/g, "")) // Trim all whitespace
      .filter(Boolean); // Remove empty strings
    const importPath = importStatement[2];
    const path = Path.join(Path.dirname(schemaPath), importPath);

    // Make sure the developer does not try to import a dependencies dependency
    const index = userTypes.findIndex((str) => str.indexOf('_') > -1);
    if (index > -1) {
      throw Error(`User defined types with '_' in their name are forbidden. This is used for Web3API import namespacing.`);
    }

    localImports.push({
      userTypes,
      path
    });
  }

  // Make sure types are unique
  const userTypeCount = (userTypes: string[]) =>
    userTypes.reduce((a: any, b: string) => ({ ...a,
      [b]: (a[b] || 0) + 1
    }), {});

  const userTypeDuplicates = (imports: LocalImport[]) => {
    const userTypes: string[] = [];
    imports.forEach((i) => userTypes.push(...i.userTypes));
    const counts = userTypeCount(userTypes);
    return Object.keys(counts)
      .filter((a) => counts[a] > 1);
  }

  const duplicateUserTypes = userTypeDuplicates(localImports);
  if (duplicateUserTypes.length > 0) {
    throw Error(`Duplicate type found: ${duplicateUserTypes}`);
  }

  return localImports;
}
