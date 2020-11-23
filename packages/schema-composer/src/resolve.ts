import {
  ExternalImport,
  LocalImport,
  SchemaResolver,
  SchemaResolvers,
  SYNTAX_REFERENCE
} from "./types";
import {
  parseExternalImports,
  parseLocalImports
} from "./parse";
import {
  template as headerTemplate,
} from "./templates/header.mustache";
import {
  template as schemaTemplate
} from "./templates/schema.mustache";
import * as Functions from "./templates/functions";

import {
  TypeInfo,
  parseSchema,
  extendType,
  addFirstLast
} from "@web3api/schema-parser";

import Mustache from "mustache";

// Remove mustache's built-in HTML escaping
Mustache.escape = (value) => value;

export function resolveImports(
  schema: string,
  schemaPath: string,
  mutation: boolean,
  resolvers: SchemaResolvers
): string {
  const importKeywordCapture = /^[#]*["{3}]*import[ \n\t]/gm;
  const externalImportCapture = /[#]*["{3}]*import[ \n\t]*{([a-zA-Z0-9_, \n\t]+)}[ \n\t]*into[ \n\t]*(\w+?)[ \n\t]*from[ \n\t]*[\"'`]([a-zA-Z0-9_.\/]+?)[\"'`]/g;
  const localImportCapture = /[#]*["{3}]*import[ \n\t]*{([a-zA-Z0-9_, \n\t]+)}[ \n\t]*from[ \n\t]*[\"'`]([a-zA-Z0-9_~\-:.\/]+?)[\"'`]/g;

  const keywords = [...schema.matchAll(importKeywordCapture)];
  const externalImportStatements = [...schema.matchAll(externalImportCapture)];
  const localImportStatments = [...schema.matchAll(localImportCapture)];
  const totalStatements = externalImportStatements.length + localImportStatments.length;

  if (keywords.length !== totalStatements) {
    throw Error(
      `Invalid import statement found, please use one of the following syntaxes...\n${SYNTAX_REFERENCE}`
    );
  }

  const externalImportsToResolve: ExternalImport[] = parseExternalImports(
    externalImportStatements, mutation
  );

  const localImportsToResolve: LocalImport[] = parseLocalImports(
    localImportStatments, schemaPath
  );

  const subTypeInfo: TypeInfo = {
    userTypes: [],
    queryTypes: [],
    importedObjectTypes: [],
    importedQueryTypes: []
  };

  resolveExternalImports(
    externalImportsToResolve,
    resolvers.external,
    subTypeInfo
  );
  resolveLocalImports(
    localImportsToResolve,
    resolvers.local,
    subTypeInfo
  );

  // Remove all import statements
  let newSchema = schema.replace(externalImportCapture, "").replace(localImportCapture, "");

  // Add the @imports directive
  newSchema = addQueryImportsDirective(
    newSchema, externalImportsToResolve, mutation
  );

  return addHeader(Mustache.render(schemaTemplate, {
    schema: newSchema,
    typeInfo: subTypeInfo
  })).replace(/[\n]{2,}/gm, '\n\n'); // Remove needless whitespace
}

function resolveExternalImports(
  importsToResolve: ExternalImport[],
  resolveSchema: SchemaResolver,
  typeInfo: TypeInfo
): void {
  for (const importToResolve of importsToResolve) {
    const { uri, namespace, importedTypes } = importToResolve;
    let schema = resolveSchema(uri);

    if (!schema) {
      throw Error(`Unable to resolve schema at "${uri}"`);
    }

    const extTypeInfo = parseSchema(schema, {
      transforms: [extendType(Functions), addFirstLast]
    });

    for (const importedType of importedTypes) {
      if (importedType === "Query" || importedType === "Mutation") {
        const type = extTypeInfo.queryTypes.find(
          (type) => type.name === importedType
        );

        if (!type) {
          throw Error(
            `Cannot find type "${importedType}" in the schema at ${uri}.\nFound: [ ${
              extTypeInfo.queryTypes.map((type) => type.name + ' ')
            }]`
          );
        }

        typeInfo.importedQueryTypes.push({
          ...type,
          uri,
          namespace
        });
      } else {
        const type = extTypeInfo.userTypes.find(
          (type) => type.name === importedType
        );

        if (!type) {
          throw Error(
            `Cannot find type "${importedType}" in the schema at ${uri}.\nFound: [ ${
              extTypeInfo.userTypes.map((type) => type.name + ' ')
            }]`
          );
        }

        typeInfo.importedObjectTypes.push({
          ...type,
          uri,
          namespace
        });
      }
    }
  }
}

function resolveLocalImports(
  importsToResolve: LocalImport[],
  resolveSchema: SchemaResolver,
  typeInfo: TypeInfo
) {
  for (const importToResolve of importsToResolve) {
    const { userTypes, path } = importToResolve;
    let schema = resolveSchema(path);

    if (!schema) {
      throw Error(`Unable to resolve schema at "${path}"`);
    }

    // Make sure the schema has the Web3API header
    if (schema.indexOf("### Web3API Header START ###") === -1) {
      schema = addHeader(schema);
    }

    // Parse the schema so we can extract types
    const localTypeInfo = parseSchema(schema, {
      transforms: [extendType(Functions), addFirstLast]
    });

    for (const userType of userTypes) {
      if (userType === "Query" || userType === "Mutation") {
        throw Error(`Importing query types from local schemas is prohibited. Tried to import from ${path}.`)
      } else {
        const type = localTypeInfo.userTypes.find(
          (type) => type.name === userType
        );

        if (!type) {
          throw Error(
            `Cannot find type "${userType}" in the schema at ${path}.\nFound: [ ${
              localTypeInfo.userTypes.map((type) => type.name + ' ')
            }]`
          );
        }

        typeInfo.userTypes.push({
          ...type
        });
      }
    }
  }
}

function addHeader(schema: string): string {
  return Mustache.render(headerTemplate, { schema });
}

function addQueryImportsDirective(schema: string, externalImports: ExternalImport[], mutation: boolean): string {
  // Append the @imports(...) directive to the query type
  const typeCapture = mutation ?
    /type[ \n\t]*Mutation[ \n\t]*{/g :
    /type[ \n\t]*Query[ \n\t]*{/g;

  // Aggregate all imported type names (namespaced)
  const externalTypeNames: string[] = [];
  externalImports.forEach((ext) =>
    externalTypeNames.push(
      ...ext.importedTypes.map((type) =>
        `${ext.namespace}_${type}`
      )
    )
  );

  let importedTypes = `${externalTypeNames.map(type => `\"${type}\"`).join(',\n    ')}`;
  const replacementQueryStr =
  `type ${mutation ? "Mutation" : "Query"} @imports(
  types: [
    ${importedTypes}
  ]
) {`

  return schema.replace(typeCapture, replacementQueryStr);
}
