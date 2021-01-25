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

import {
  TypeInfo,
  parseSchema,
  ObjectDefinition,
  ImportedObjectDefinition,
  visitImportedQueryDefinition,
  visitImportedObjectDefinition,
  TypeInfoTransforms,
  visitObjectDefinition,
  GenericDefinition
} from "@web3api/schema-parse";
import Mustache from "mustache";

// Remove mustache's built-in HTML escaping
Mustache.escape = (value) => value;

export function addHeader(schema: string): string {
  return Mustache.render(headerTemplate, { schema });
}

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

  const externalImports = await resolveExternalImports(
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
    externalImports,
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
): Promise<string[]> {

  const trackImportedTypes: string[] = [];

  for (const importToResolve of importsToResolve) {
    const { uri, namespace, importedTypes } = importToResolve;

    // Resolve the schema
    const schema = await resolveSchema(uri);

    if (!schema) {
      throw Error(`Unable to resolve schema at "${uri}"`);
    }

    // Parse the schema into TypeInfo
    const extTypeInfo = parseSchema(schema);

    // A transformation that converts all object definitions into
    // imported object definitions
    const transformObjectDefinitions = (
      importedObjectTypes: Record<string, ImportedObjectDefinition>
    ): TypeInfoTransforms => ({
      enter: {
        // TODO: try visiting PropertyDefinition instead
        // TODO: make sure parsing works with imports of import
        // TODO: make sure visiting works as expected
        ObjectDefinition: (def: ObjectDefinition) => {

          const namespacedType = appendNamespace(namespace, def.type.replace('?', ''));

          const importedObject: ImportedObjectDefinition = {
            ...def,
            type: namespacedType,
            name: null,
            required: null,
            uri,
            namespace
          }

          if (!importedObjectTypes[importedObject.name]) {
            importedObjectTypes[importedObject.name] = importedObject;

            if (trackImportedTypes.indexOf(importedObject.name) === -1) {
              trackImportedTypes.push(importedObject.name);
            }
          }

          return def;
        }
      }
    });

    // Keep track of all imported object type names
    const importedObjectTypes: Record<string, ImportedObjectDefinition> = { };

    // For each imported type to resolve
    for (const importedType of importedTypes) {

      let extTypes: GenericDefinition[] = [];
      let aggTypes: GenericDefinition[] = [];
      let visitorFunc: Function = () => {};

      // If it's a query type
      if (importedType === "Query" || importedType === "Mutation") {
        extTypes = extTypeInfo.queryTypes;
        aggTypes = typeInfo.importedQueryTypes;
        visitorFunc = visitImportedQueryDefinition;
      } else if (importedType.endsWith("_Query") || importedType.endsWith("_Mutation")) {
        throw Error(
          `Cannot import an import's imported query type. Tried to import ${importedType} from ${uri}.`
        );
      } else {
        extTypes = extTypeInfo.objectTypes.findIndex(
          (def) => def.name === importedType
        ) > -1 ? extTypeInfo.objectTypes : extTypeInfo.importedObjectTypes;
        aggTypes = typeInfo.importedObjectTypes;
        visitorFunc = visitImportedObjectDefinition;
      }

      // Find the type's definition in the schema's TypeInfo
      const type = extTypes.find(
        (type) => type.name === importedType
      );

      if (!type) {
        throw Error(
          `Cannot find type "${importedType}" in the schema at ${uri}.\nFound: [ ${extTypes.map(
            (type) => type.name + " "
          )}]`
        );
      }

      // Convert the QueryDefinition into an ImportedQueryDefinition
      let modifiedImportedType = {
        ...type,
        type: null,
        required: null,
        name: appendNamespace(namespace, type.name),
        uri,
        namespace
      };

      // Track any imported object types that this query type depends on
      modifiedImportedType = visitorFunc(
        modifiedImportedType,
        transformObjectDefinitions(importedObjectTypes)
      );

      // Save the imported types to the aggregate typeInfo
      aggTypes.push(modifiedImportedType);
      trackImportedTypes.push(modifiedImportedType.name);
    }

    // Add all imported types into the aggregate TypeInfo
    for (const importedObjectName of Object.keys(importedObjectTypes)) {
      if (typeInfo.importedObjectTypes.findIndex(
        (def) => def.name === importedObjectName
      ) === -1) {
        typeInfo.importedObjectTypes.push(
          importedObjectTypes[importedObjectName]
        );
      }

      trackImportedTypes.push(importedObjectName);
    }
  }

  return trackImportedTypes;
}

async function resolveLocalImports(
  importsToResolve: LocalImport[],
  resolveSchema: SchemaResolver,
  typeInfo: TypeInfo
): Promise<void> {
  for (const importToResolve of importsToResolve) {
    const { objectTypes, path } = importToResolve;

    // Resolve the schema
    let schema = await resolveSchema(path);

    if (!schema) {
      throw Error(`Unable to resolve schema at "${path}"`);
    }

    // Make sure the schema has the Web3API header
    if (schema.indexOf("### Web3API Header START ###") === -1) {
      schema = addHeader(schema);
    }

    // Parse the schema into TypeInfo
    const localTypeInfo = parseSchema(schema);

    // Keep track of all imported object type names
    const importedObjectTypes: Record<string, ObjectDefinition> = { };

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

        visitObjectDefinition(type, {
          enter: {
            ObjectDefinition: (def: ObjectDefinition) => {
    
              // Skip objects that we've already processed
              if (importedObjectTypes[def.name]) {
                return def;
              }
    
              importedObjectTypes[def.name] = def;
              return def;
            }
          }
        });

        typeInfo.objectTypes.push({
          ...type,
        });
      }
    }

    // Add all imported types into the aggregate TypeInfo
    for (const importedObjectName of Object.keys(importedObjectTypes)) {
      if (typeInfo.objectTypes.findIndex(
        (def) => def.name === importedObjectName
      ) === -1) {
        typeInfo.objectTypes.push(
          importedObjectTypes[importedObjectName]
        );
      }
    }
  }
}

function appendNamespace(namespace: string, str: string) {
  return `${namespace}_${str}`;
}

function addQueryImportsDirective(
  schema: string,
  externalImports: string[],
  mutation: boolean
): string {
  // Append the @imports(...) directive to the query type
  const typeCapture = mutation
    ? /type[ \n\t]*Mutation[ \n\t]*{/g
    : /type[ \n\t]*Query[ \n\t]*{/g;

  const importedTypes = `${externalImports
    .map((type) => `\"${type}\"`)
    .join(",\n    ")}`;
  const replacementQueryStr = `type ${mutation ? "Mutation" : "Query"} @imports(
  types: [
    ${importedTypes}
  ]
) {`;

  return schema.replace(typeCapture, replacementQueryStr);
}
