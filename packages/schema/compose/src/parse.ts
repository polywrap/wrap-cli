import { ExternalImport, LocalImport, SYNTAX_REFERENCE, Use } from "./types";
import { getDuplicates } from "./utils";

import { CapabilityType } from "@polywrap/schema-parse";

export function parseUse(useStatements: RegExpMatchArray[]): Use[] {
  const uses: Use[] = [];

  for (const useStatement of useStatements) {
    if (useStatement.length !== 3) {
      throw Error(
        `Invalid use statement found:\n${useStatement[0]}\n` +
          `Please use the following syntax...\n${SYNTAX_REFERENCE}`
      );
    }

    const usedTypes = useStatement[1]
      .split(",")
      .map((str) => str.replace(/\s+/g, "")) // Trim all whitespace
      .filter(Boolean); // Remove empty strings

    const useForName = useStatement[2];

    // Make sure the developer does not import the same dependency more than once
    const duplicateUsedTypes = getDuplicates(usedTypes);
    if (duplicateUsedTypes.length > 0) {
      throw Error(
        `Duplicate type found: ${duplicateUsedTypes} \nIn Use: ${useForName}`
      );
    }

    uses.push({
      usedTypes: usedTypes as CapabilityType[],
      namespace: useForName,
    });
  }
  return uses;
}

export function parseExternalImports(
  imports: RegExpMatchArray[]
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
      // Trim all whitespace and brackets
      .map((str) => str.replace(/(\s+|\{|\})/g, ""))
      // Remove empty strings
      .filter(Boolean);

    const importFromName = importStatement[3];

    // Make sure the developer does not import the same dependency more than once
    const duplicateimportedTypes = getDuplicates(importedTypes);
    if (duplicateimportedTypes.length > 0) {
      throw Error(
        `Duplicate type found: ${duplicateimportedTypes} \nIn import: ${importFromName}`
      );
    }

    // Make sure the developer does not try to import a dependencies dependency
    const index = importedTypes.findIndex((str) => str.indexOf("_") > -1);
    if (index > -1) {
      throw Error(
        `Importing a dependency's imported type is forbidden. Only import types that do not have an '_' in the typename.`
      );
    }

    const namespace = importStatement[2];
    const uri = importStatement[3];

    externalImports.push({
      importedTypes,
      namespace,
      importFrom: uri,
    });
  }

  // Make sure namespaces are unique
  const namespaces = externalImports.map((extImport) => extImport.namespace);
  const duplicateNamespaces = getDuplicates(namespaces);
  if (duplicateNamespaces.length > 0) {
    throw Error(`Duplicate namespaces found: ${duplicateNamespaces}`);
  }

  // Make sure all uris have the same namespace
  const uriToNamespace: Record<string, string> = {};
  for (const ext of externalImports) {
    if (uriToNamespace[ext.importFrom]) {
      if (uriToNamespace[ext.importFrom] !== ext.namespace) {
        throw Error(
          `Imports from a single URI must be imported into the same namespace.\nURI: ${
            ext.importFrom
          }\nNamespace 1: ${ext.namespace}\nNamespace 2: ${
            uriToNamespace[ext.importFrom]
          }`
        );
      }
    } else {
      uriToNamespace[ext.importFrom] = ext.namespace;
    }
  }

  return externalImports;
}

export function parseLocalImports(imports: RegExpMatchArray[]): LocalImport[] {
  const localImports: LocalImport[] = [];

  for (const importStatement of imports) {
    if (importStatement.length !== 3) {
      throw Error(
        `Invalid local import statement found:\n${importStatement[0]}\n` +
          `Please use the following syntax...\n${SYNTAX_REFERENCE}`
      );
    }

    const importTypes = importStatement[1]
      .split(",")
      // Trim all whitespace and brackets
      .map((str) => str.replace(/(\s+|\{|\})/g, ""))
      // Remove empty strings
      .filter(Boolean);
    const importFrom = importStatement[2];

    // Make sure the developer does not try to import a dependencies dependency
    const index = importTypes.findIndex((str) => str.indexOf("_") > -1);
    if (index > -1) {
      throw Error(
        `User defined types with '_' in their name are forbidden. This is used for Polywrap import namespacing.`
      );
    }

    localImports.push({
      importedTypes: importTypes,
      importFrom: importFrom,
    });
  }

  // Make sure types are unique
  const localImportNames: string[] = [];
  localImports.forEach((imp) => localImportNames.push(...imp.importedTypes));
  const duplicateImportTypes = getDuplicates(localImportNames);
  if (duplicateImportTypes.length > 0) {
    throw Error(`Duplicate type found: ${duplicateImportTypes}`);
  }

  return localImports;
}
