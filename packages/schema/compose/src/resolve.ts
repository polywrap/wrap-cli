/* eslint-disable no-useless-escape */
import {
  ExternalImport,
  LocalImport,
  SchemaResolver,
  SchemaResolvers,
  SYNTAX_REFERENCE,
} from "./types";
import { parseExternalImports, parseLocalImports } from "./parse";
import { template as headerTemplate } from "./templates/header.mustache";
import * as Functions from "./templates/functions";

import {
  TypeInfo,
  parseSchema,
  extendType,
  addFirstLast,
} from "@web3api/schema-parse";
import Mustache from "mustache";

// Remove mustache's built-in HTML escaping
Mustache.escape = (value) => value;

export async function resolveImports(
  schema: string,
  schemaPath: string,
  mutation: boolean,
  resolvers: SchemaResolvers
): Promise<{
  schema: string;
  typeInfo: TypeInfo;
}> {
  const importKeywordCapture = /^[#]*["{3}]*import[ \n\t]/gm;
  const externalImportCapture = /[#]*["{3}]*import[ \n\t]*{([a-zA-Z0-9_, \n\t]+)}[ \n\t]*into[ \n\t]*(\w+?)[ \n\t]*from[ \n\t]*[\"'`]([a-zA-Z0-9_~.:\/]+?)[\"'`]/g;
  const localImportCapture = /[#]*["{3}]*import[ \n\t]*{([a-zA-Z0-9_, \n\t]+)}[ \n\t]*from[ \n\t]*[\"'`]([a-zA-Z0-9_~\-:.\/]+?)[\"'`]/g;

  const keywords = [...schema.matchAll(importKeywordCapture)];
  const externalImportStatements = [...schema.matchAll(externalImportCapture)];
  const localImportStatments = [...schema.matchAll(localImportCapture)];
  const totalStatements =
    externalImportStatements.length + localImportStatments.length;

  if (keywords.length !== totalStatements) {
    throw Error(
      `Invalid import statement found in file ${schemaPath}.\nPlease use one of the following syntaxes...\n${SYNTAX_REFERENCE}`
    );
  }

  const externalImportsToResolve: ExternalImport[] = parseExternalImports(
    externalImportStatements,
    mutation
  );

  const localImportsToResolve: LocalImport[] = parseLocalImports(
    localImportStatments,
    schemaPath
  );

  const subTypeInfo: TypeInfo = {
    objectTypes: [],
    queryTypes: [],
    importedObjectTypes: [],
    importedQueryTypes: [],
  };

  await resolveExternalImports(
    externalImportsToResolve,
    resolvers.external,
    subTypeInfo
  );
  await resolveLocalImports(
    localImportsToResolve,
    resolvers.local,
    subTypeInfo
  );

  // Remove all import statements
  let newSchema = schema
    .replace(externalImportCapture, "")
    .replace(localImportCapture, "");

  // Add the @imports directive
  newSchema = addQueryImportsDirective(
    newSchema,
    externalImportsToResolve,
    mutation
  );

  return {
    schema: newSchema,
    typeInfo: subTypeInfo,
  };
}

async function resolveExternalImports(
  importsToResolve: ExternalImport[],
  resolveSchema: SchemaResolver,
  typeInfo: TypeInfo
): Promise<void> {
  for (const importToResolve of importsToResolve) {
    const { uri, namespace, importedTypes } = importToResolve;
    const schema = await resolveSchema(uri);

    if (!schema) {
      throw Error(`Unable to resolve schema at "${uri}"`);
    }

    const extTypeInfo = parseSchema(schema, {
      transforms: [extendType(Functions), addFirstLast],
    });

    for (const importedType of importedTypes) {
      if (importedType === "Query" || importedType === "Mutation") {
        const type = extTypeInfo.queryTypes.find(
          (type) => type.name === importedType
        );

        if (!type) {
          throw Error(
            `Cannot find type "${importedType}" in the schema at ${uri}.\nFound: [ ${extTypeInfo.queryTypes.map(
              (type) => type.name + " "
            )}]`
          );
        }

        typeInfo.importedQueryTypes.push({
          ...type,
          uri,
          namespace,
        });
      } else {
        const type = extTypeInfo.objectTypes.find(
          (type) => type.name === importedType
        );

        if (!type) {
          throw Error(
            `Cannot find type "${importedType}" in the schema at ${uri}.\nFound: [ ${extTypeInfo.objectTypes.map(
              (type) => type.name + " "
            )}]`
          );
        }

        typeInfo.importedObjectTypes.push({
          ...type,
          uri,
          namespace,
        });
      }
    }
  }
}

async function resolveLocalImports(
  importsToResolve: LocalImport[],
  resolveSchema: SchemaResolver,
  typeInfo: TypeInfo
): Promise<void> {
  for (const importToResolve of importsToResolve) {
    const { objectTypes, path } = importToResolve;
    let schema = await resolveSchema(path);

    if (!schema) {
      throw Error(`Unable to resolve schema at "${path}"`);
    }

    // Make sure the schema has the Web3API header
    if (schema.indexOf("### Web3API Header START ###") === -1) {
      schema = addHeader(schema);
    }

    // Parse the schema so we can extract types
    const localTypeInfo = parseSchema(schema, {
      transforms: [extendType(Functions), addFirstLast],
    });

    for (const objectType of objectTypes) {
      if (objectType === "Query" || objectType === "Mutation") {
        throw Error(
          `Importing query types from local schemas is prohibited. Tried to import from ${path}.`
        );
      } else {
        const type = localTypeInfo.objectTypes.find(
          (type) => type.name === objectType
        );

        if (!type) {
          throw Error(
            `Cannot find type "${objectType}" in the schema at ${path}.\nFound: [ ${localTypeInfo.objectTypes.map(
              (type) => type.name + " "
            )}]`
          );
        }

        typeInfo.objectTypes.push({
          ...type,
        });
      }
    }
  }
}

export function addHeader(schema: string): string {
  return Mustache.render(headerTemplate, { schema });
}

function addQueryImportsDirective(
  schema: string,
  externalImports: ExternalImport[],
  mutation: boolean
): string {
  // Append the @imports(...) directive to the query type
  const typeCapture = mutation
    ? /type[ \n\t]*Mutation[ \n\t]*{/g
    : /type[ \n\t]*Query[ \n\t]*{/g;

  // Aggregate all imported type names (namespaced)
  const externalTypeNames: string[] = [];
  externalImports.forEach((ext) =>
    externalTypeNames.push(
      ...ext.importedTypes.map((type) => `${ext.namespace}_${type}`)
    )
  );

  const importedTypes = `${externalTypeNames
    .map((type) => `\"${type}\"`)
    .join(",\n    ")}`;
  const replacementQueryStr = `type ${mutation ? "Mutation" : "Query"} @imports(
  types: [
    ${importedTypes}
  ]
) {`;

  return schema.replace(typeCapture, replacementQueryStr);
}
