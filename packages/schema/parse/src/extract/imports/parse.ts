import { SYNTAX_REFERENCE } from "./constants";
import { getDuplicates } from "./utils";

import Path from "path";

export interface ExternalImportStatement {
  importedTypes: string[];
  namespace: string;
  uri: string;
}

export interface LocalImportStatement {
  importedTypes: string[];
  path: string;
}

export function parseExternalImports(
  imports: RegExpMatchArray[]
): ExternalImportStatement[] {
  const externalImports: ExternalImportStatement[] = [];

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
      uri,
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
    if (uriToNamespace[ext.uri]) {
      if (uriToNamespace[ext.uri] !== ext.namespace) {
        throw Error(
          `Imports from a single URI must be imported into the same namespace.\nURI: ${ext.uri
          }\nNamespace 1: ${ext.namespace}\nNamespace 2: ${uriToNamespace[ext.uri]
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
): LocalImportStatement[] {
  const localImports: LocalImportStatement[] = [];

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
    const importPath = importStatement[2];
    const path = Path.join(Path.dirname(schemaPath), importPath);

    // Make sure the developer does not try to import a dependencies dependency
    const index = importTypes.findIndex((str) => str.indexOf("_") > -1);
    if (index > -1) {
      throw Error(
        `User defined types with '_' in their name are forbidden. This is used for Polywrap import namespacing.`
      );
    }

    localImports.push({
      importedTypes: importTypes,
      path,
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

export function parseImportStatements(
  schema: string,
  schemaPath: string
) {
  const importKeywordCapture = /^(?:#|""")*import\s/gm;
  const externalImportCapture = /(?:#|""")*import\s*(?:({[^}]+}|\*))\s*into\s*(\w+?)\s*from\s*[\"'`]([^\"'`\s]+)[\"'`]/g;
  const localImportCapture = /(?:#|""")*import\s*(?:({[^}]+}|\*))\s*from\s*[\"'`]([^\"'`\s]+)[\"'`]/g;

  const keywords = [...schema.matchAll(importKeywordCapture)];
  const externalImportStatements = [...schema.matchAll(externalImportCapture)];
  const localImportStatements = [...schema.matchAll(localImportCapture)];
  const totalStatements =
    externalImportStatements.length + localImportStatements.length;

  if (keywords.length !== totalStatements) {
    throw Error(
      `Invalid import statement found in file ${schemaPath}.\nPlease use one of the following syntaxes...\n${SYNTAX_REFERENCE}`
    );
  }

  const externalImportsToResolve: ExternalImportStatement[] = parseExternalImports(
    externalImportStatements
  );

  const localImportsToResolve: LocalImportStatement[] = parseLocalImports(
    localImportStatements,
    schemaPath
  );

  return {
    externalImportStatements: externalImportsToResolve,
    localImportStatements: localImportsToResolve,
  }
}

export function parseExternalImportStatements(
  schema: string,
) {
  const importKeywordCapture = /^(?:#|""")*import\s/gm;
  const externalImportCapture = /(?:#|""")*import\s*(?:({[^}]+}|\*))\s*into\s*(\w+?)\s*from\s*[\"'`]([^\"'`\s]+)[\"'`]/g;
  const localImportCapture = /(?:#|""")*import\s*(?:({[^}]+}|\*))\s*from\s*[\"'`]([^\"'`\s]+)[\"'`]/g;

  const keywords = [...schema.matchAll(importKeywordCapture)];
  const externalImportStatements = [...schema.matchAll(externalImportCapture)];
  const localImportStatements = [...schema.matchAll(localImportCapture)];
  const totalStatements =
    externalImportStatements.length + localImportStatements.length;

  if (keywords.length !== totalStatements) {
    throw Error(
      `Invalid import statement found in file.\nPlease use one of the following syntaxes...\n${SYNTAX_REFERENCE}`
    );
  }

  const externalImportsToResolve: ExternalImportStatement[] = parseExternalImports(
    externalImportStatements
  );

  return externalImportsToResolve;
}