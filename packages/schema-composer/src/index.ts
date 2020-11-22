import { template as headerTemplate } from "./templates/header.mustache";
import { template as schemaTemplate } from "./templates/schema.mustache";

import { parseSchema, TypeInfo } from "@web3api/schema-parser";

import Mustache from "mustache";

export type SchemaResolver = (uri: string) => string;

export interface ComposerOptions {
  schemas: {
    query?: string;
    mutation?: string;
  },
  resolveSchema: SchemaResolver
}

export interface ComposerOutput {
  query?: string;
  mutation?: string;
  combined?: string;
}

export function composeSchema(
  options: ComposerOptions
): ComposerOutput {
  const { schemas, resolveSchema } = options;
  let query = schemas.query;
  let mutation = schemas.mutation;

  if (query) {
    query = resolveImports(query, false, resolveSchema);
    query = prependHeader(query);
  }

  if (mutation) {
    // TODO:
    // inject empty query type
    mutation = resolveImports(mutation, true, resolveSchema);
    mutation = prependHeader(mutation);
  }

  let combined: string | undefined;

  if (mutation && query) {
    // TODO:
    // combine mutation & query
    // remove empty query type
  } else if (mutation) {
    combined = mutation;
  } else if (query) {
    combined = query;
  }

  return {
    query,
    mutation,
    combined
  };
}

function resolveImports(schema: string, mutation: boolean, resolveSchema: SchemaResolver): string {
  const importKeywordCapture = /^import[ \n\t]/gm;
  const importCapture = /import[ \n\t]*{([a-zA-Z0-9_, \n\t]+)}[ \n\t]*into[ \n\t]*(\w+?)[ \n\t]*from[ \n\t]*[\"'`]([a-zA-Z0-9_.\/]+?)[\"'`]/g;

  const keywords = [...schema.matchAll(importKeywordCapture)];
  const imports = [...schema.matchAll(importCapture)];

  if (keywords.length !== imports.length) {
    throw Error(`Invalid import statement found, please use the syntax:\nimport { Type, Query } into Namespace from "uri"`)
  }

  interface Import {
    importedTypes: string[];
    namespace: string;
    uri: string;
  }

  const importsToResolve: Import[] = [];

  for (const importStatement of imports) {

    if (importStatement.length !== 4) {
      throw Error(`Invalid import statement found:\n${importStatement[0]}`);
    }

    const importedTypes = importStatement[1].split(',')
      .map((str) => str.replace("\\s+", "")) // Trim all whitespace
      .filter(Boolean); // Remove empty strings
    const namespace = importStatement[2];
    const uri = importStatement[3];

    if (!mutation && importedTypes.indexOf("Mutation") > -1) {
      throw Error(
        `Query modules cannot import Mutations, write operations are prohibited.\nSee import statement for namespace "${namespace}" at uri "${uri}"`
      );
    }

    importsToResolve.push({
      importedTypes,
      namespace,
      uri
    });
  }

  // Make sure namespaces are unique
  const namespaceCounts = (imports: Import[]) =>
    imports.reduce((a: any, b: Import) => ({ ...a,
      [b.namespace]: (a[b.namespace] || 0) + 1
    }), {});

  const namespaceDuplicates = (imports: Import[]) => {
    const counts = namespaceCounts(imports);
    return Object.keys(counts)
      .filter((a) => counts[a] > 1);
  }

  const duplicateNamespaces = namespaceDuplicates(importsToResolve);
  if (duplicateNamespaces.length > 0) {
    throw Error(`Duplicate namespaces found: ${duplicateNamespaces}`);
  }

  const subTypeInfo: TypeInfo = {
    userTypes: [],
    queryTypes: [],
    importedObjectTypes: [],
    importedQueryTypes: []
  };

  for (const importToResolve of importsToResolve) {
    const { uri, namespace, importedTypes } = importToResolve;
    let schema = resolveSchema(uri);

    // Make sure the schema has the Web3API header
    if (schema.indexOf("### Web3API Header START ###") === -1) {
      schema = prependHeader(schema);
    }

    const typeInfo = parseSchema(schema);

    for (const importedType of importedTypes) {
      if (importedType === "Query" || importedType === "Mutation") {
        const type = typeInfo.queryTypes.find(
          (type) => type.name === importedType
        );

        if (!type) {
          throw Error(
            `Cannot find type "${importedType}" in the schema at ${uri}.\nFound: [ ${
              typeInfo.queryTypes.map((type) => type.name + ' ')
            }]`
          );
        }

        subTypeInfo.importedQueryTypes.push({
          ...type,
          uri,
          namespace
        });
      } else {
        const type = typeInfo.userTypes.find(
          (type) => type.name === importedType
        );

        if (!type) {
          throw Error(
            `Cannot find type "${importedType}" in the schema at ${uri}.\nFound: [ ${
              typeInfo.userTypes.map((type) => type.name + ' ')
            }]`
          );
        }

        subTypeInfo.importedObjectTypes.push({
          ...type,
          uri,
          namespace
        });
      }
    }
  }

  // TODO: add toGraphQL to the typeInfo
  // TODO: add the imports directive to the query & mutation types
  // TODO: render new schema { schema, namespace, uri, typeInfo }
  // TODO: refactor all templates to export { template, functions }?
  return Mustache.render(schemaTemplate, { schema, typeInfo: subTypeInfo });
}

function prependHeader(schema: string): string {
  return Mustache.render(headerTemplate, { schema });
}
