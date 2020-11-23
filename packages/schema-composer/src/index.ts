import { template as headerTemplate } from "./templates/header.mustache";
import { template as schemaTemplate } from "./templates/schema.mustache";
import * as Functions from "./templates/functions";

import {
  TypeInfo,
  addFirstLast,
  extendType,
  parseSchema
} from "@web3api/schema-parser";

import Path from "path";
import Mustache from "mustache";

// Remove mustache's built-in HTML escaping
Mustache.escape = (value) => value;

export type SchemaResolver = (uriOrPath: string) => string;

export interface SchemaFile {
  schema: string;
  absolutePath: string;
}

export interface SchemaResolvers {
  external: SchemaResolver;
  local: SchemaResolver;
}

export interface ComposerOptions {
  schemas: {
    query?: SchemaFile;
    mutation?: SchemaFile;
  },
  resolvers: SchemaResolvers;
}

export interface ComposerOutput {
  query?: string;
  mutation?: string;
  combined?: string;
}

export function composeSchema(
  options: ComposerOptions
): ComposerOutput {
  const { schemas, resolvers } = options;
  let querySchema = schemas.query?.schema;
  const queryPath = schemas.query?.absolutePath;
  let mutationSchema = schemas.mutation?.schema;
  const mutationPath = schemas.mutation?.absolutePath;

  if (querySchema && queryPath !== undefined) {
    querySchema = resolveImports(
      querySchema, queryPath, false, resolvers
    );
    querySchema = prependHeader(querySchema);
  }

  if (mutationSchema && mutationPath !== undefined) {
    // TODO:
    // inject empty query type
    mutationSchema = resolveImports(
      mutationSchema, mutationPath, true, resolvers
    );
    mutationSchema = prependHeader(mutationSchema);
  }

  let combined: string | undefined;

  if (mutationSchema && querySchema) {
    // TODO:
    // combine mutation & query
    // remove empty query type
  } else if (mutationSchema) {
    combined = mutationSchema;
  } else if (querySchema) {
    combined = querySchema;
  }

  return {
    query: querySchema,
    mutation: mutationSchema,
    combined: combined
  };
}

// TODO: move this into separate files
interface ExternalImport {
  importedTypes: string[];
  namespace: string;
  uri: string;
}

interface LocalImport {
  userTypes: string[];
  path: string;
}

const SYNTAX_REFERENCE =
`External Import: import { Type, Query } into Namespace from "external.uri"\n` +
`Local Import: import { Type } from "./local/path/file.graphql"`;

function resolveImports(
  schema: string,
  schemaPath: string,
  mutation: boolean,
  resolvers: SchemaResolvers
): string {
  const importKeywordCapture = /^[#]*["{3}]*import[ \n\t]/gm;
  const externalImportCapture = /import[ \n\t]*{([a-zA-Z0-9_, \n\t]+)}[ \n\t]*into[ \n\t]*(\w+?)[ \n\t]*from[ \n\t]*[\"'`]([a-zA-Z0-9_.\/]+?)[\"'`]/g;
  const localImportCapture = /import[ \n\t]*{([a-zA-Z0-9_, \n\t]+)}[ \n\t]*from[ \n\t]*[\"'`]([a-zA-Z0-9_~\-:.\/]+?)[\"'`]/g;

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

  const localImportsToResolve: LocalImport[] = parseInternalImports(
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

  const newSchema = addQueryImportsDirective(
    schema, externalImportsToResolve, mutation
  );

  // TODO: refactor all templates to export { template, functions }?
  return Mustache.render(schemaTemplate, {
    schema: newSchema,
    typeInfo: subTypeInfo
  });
}

function prependHeader(schema: string): string {
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

function parseExternalImports(imports: RegExpMatchArray[], mutation: boolean): ExternalImport[] {
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

function parseInternalImports(imports: RegExpMatchArray[], schemaPath: string): LocalImport[] {
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
      schema = prependHeader(schema);
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
