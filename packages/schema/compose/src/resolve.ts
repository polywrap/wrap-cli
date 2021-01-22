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
  ObjectDefinition,
  ArrayDefinition,
  AnyDefinition,
  QueryDefinition,
  PropertyDefinition,
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

        resolveExternalQueryObjects(
          type,
          typeInfo,
          extTypeInfo,
          uri,
          namespace
        );
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

        resolveExternalObjectObjects(
          type,
          typeInfo,
          extTypeInfo,
          uri,
          namespace
        );
        typeInfo.importedObjectTypes.push({
          ...type,
          uri,
          namespace,
        });
      }
    }
  }
}

function resolveExternalQueryObjects(
  query: QueryDefinition,
  typeInfo: TypeInfo,
  extTypeInfo: TypeInfo,
  uri: string,
  namespace: string
): void {
  for (const method of query.methods) {
    for (const argument of method.arguments) {
      resolveImportedObjectProperties(
        argument,
        typeInfo,
        extTypeInfo,
        uri,
        namespace
      );
    }

    if (method.return) {
      resolveImportedObjectProperties(
        method.return,
        typeInfo,
        extTypeInfo,
        uri,
        namespace
      );
    }
  }
}

function resolveExternalObjectObjects(
  object: ObjectDefinition,
  typeInfo: TypeInfo,
  extTypeInfo: TypeInfo,
  uri: string,
  namespace: string
): void {
  for (const property of object.properties) {
    resolveImportedObjectProperties(
      property,
      typeInfo,
      extTypeInfo,
      uri,
      namespace
    );
  }
}

function resolveImportedObjectProperties(
  property: PropertyDefinition,
  typeInfo: TypeInfo,
  extTypeInfo: TypeInfo,
  uri: string,
  namespace: string
): void {
  const object = getPropertyObject(property);

  if (!object) {
    return;
  }

  const type = parseType(property.type as string)[0];
  if (!isAlreadyResolved(type, typeInfo)) {
    const importedObjectDefinition = getImportedObjectDefinition(
      type,
      extTypeInfo
    );
    typeInfo.importedObjectTypes.push({
      ...importedObjectDefinition,
      uri,
      namespace,
    });

    resolveExternalObjectObjects(
      importedObjectDefinition,
      typeInfo,
      extTypeInfo,
      uri,
      namespace
    );
  }

  updatePropertyTypeNamespace(property, type, namespace);
}

function getPropertyObject(property: AnyDefinition): ObjectDefinition | void {
  let object: ObjectDefinition | undefined;
  if (property.object) {
    object = property.object;
  } else if (property.array) {
    const baseType = getArrayBaseType(property.array);
    if (baseType.object) {
      object = baseType.object;
    }
  }

  return object;
}

function parseType(type: string): RegExpMatchArray {
  const typeMatch = type.match(/([A-Za-z1-9_]+)/);

  if (!typeMatch) {
    throw new Error("No object type found");
  }

  return typeMatch;
}

function isAlreadyResolved(type: string, typeInfo: TypeInfo): boolean {
  for (const importedObject of typeInfo.importedObjectTypes) {
    if (importedObject.name === type) {
      return true;
    }
  }

  return false;
}

function getImportedObjectDefinition(
  type: string,
  extTypeInfo: TypeInfo
): ObjectDefinition {
  for (const objectType of extTypeInfo.objectTypes) {
    if (objectType.name === type) {
      return objectType;
    }
  }

  for (const objectType of extTypeInfo.importedObjectTypes) {
    if (objectType.name === type) {
      return objectType;
    }
  }

  throw new Error(`Type ${type} is not defined`);
}

function updatePropertyTypeNamespace(
  property: AnyDefinition,
  type: string,
  namespace: string
): void {
  property.type = (property.type as string).replace(
    /[A-Za-z1-9_]+/,
    namespace + "_" + type
  );
}

function getArrayBaseType(array: ArrayDefinition): ArrayDefinition {
  if (array.array) {
    return getArrayBaseType(array.array);
  } else {
    return array;
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

        resolveLocalObjectTypeObjects(type, typeInfo, localTypeInfo);
        typeInfo.objectTypes.push({
          ...type,
        });
      }
    }
  }
}

function resolveLocalObjectTypeObjects(
  object: ObjectDefinition,
  typeInfo: TypeInfo,
  localTypeInfo: TypeInfo
): void {
  for (const property of object.properties) {
    resolveUserObjectProperties(property, typeInfo, localTypeInfo);
  }
}

function resolveUserObjectProperties(
  property: PropertyDefinition,
  typeInfo: TypeInfo,
  localTypeInfo: TypeInfo
): void {
  const object = getPropertyObject(property);
  if (!object) {
    return;
  }

  const type = parseType(property.type as string)[0];
  if (!isAlreadyResolved(type, typeInfo)) {
    const objectDefinition = getLocalObjectDefinition(type, localTypeInfo);
    typeInfo.objectTypes.push(objectDefinition);

    resolveLocalObjectTypeObjects(objectDefinition, typeInfo, localTypeInfo);
  }
}

function getLocalObjectDefinition(
  type: string,
  localTypeInfo: TypeInfo
): ObjectDefinition {
  for (const objectType of localTypeInfo.objectTypes) {
    if (objectType.name === type) {
      return objectType;
    }
  }

  throw new Error(`Type ${type} is not defined`);
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
