import { ExternalImport, LocalImport, SYNTAX_REFERENCE } from "./types";

import Path from "path";
import { ObjectTypeDefinitionNode, parse, visit } from "graphql";
import { getDuplicates } from "./utils";

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

  const namespaces = externalImports.map((extImport) => extImport.namespace);
  const duplicateNamespaces = getDuplicates(namespaces);
  if (duplicateNamespaces.length > 0) {
    throw Error(`Duplicate namespaces found: ${duplicateNamespaces}`);
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

    const userTypes = importStatement[1]
      .split(",")
      .map((str) => str.replace(/\s+/g, "")) // Trim all whitespace
      .filter(Boolean); // Remove empty strings
    const importPath = importStatement[2];
    const path = Path.join(Path.dirname(schemaPath), importPath);

    // Make sure the developer does not try to import a dependencies dependency
    const index = userTypes.findIndex((str) => str.indexOf("_") > -1);
    if (index > -1) {
      throw Error(
        `User defined types with '_' in their name are forbidden. This is used for Web3API import namespacing.`
      );
    }

    localImports.push({
      userTypes,
      path,
    });
  }

  // Make sure types are unique

  const userTypesNames = localImports.reduce<string[]>(
    (accumulator, localImport) => accumulator.concat(localImport.userTypes),
    []
  );
  const duplicateUserTypes = getDuplicates(userTypesNames);
  if (duplicateUserTypes.length > 0) {
    throw Error(`Duplicate type found: ${duplicateUserTypes}`);
  }

  return localImports;
}

export function parseSchemaUserDefinedTypes(schema: string) {
  const userTypes: string[] = [];
  const userTypesWithUnderscores: string[] = [];
  const schemaAST = parse(schema);

  visit(schemaAST, {
    enter: {
      ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
        if (node.name.value.includes("_")) {
          userTypesWithUnderscores.push(node.name.value);
        }

        userTypes.push(node.name.value);
      },
    },
  });

  if (userTypesWithUnderscores.length) {
    throw new Error(
      `User defined type names cannot contain underscores: ${userTypesWithUnderscores.map(
        (userType) => `\n- ${userType}`
      )}`
    );
  }

  return userTypes;
}
