/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */

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
  QueryDefinition,
  TypeInfoTransforms,
  visitObjectDefinition,
  visitQueryDefinition,
  ImportedQueryDefinition,
  DefinitionKind,
  PropertyDefinition,
  populatePropertyType,
  visitImportedQueryDefinition,
  visitImportedObjectDefinition,
  ImportedEnumDefinition,
  EnumDefinition,
  visitEnumDefinition,
  visitImportedEnumDefinition,
  GenericDefinition,
  isKind,
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
    enumTypes: [],
    importedEnumTypes: [],
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
  newSchema = addQueryImportsDirective(newSchema, externalImports, mutation);

  return {
    schema: newSchema,
    typeInfo: subTypeInfo,
  };
}

interface Namespaced {
  __namespaced?: boolean;
}

type ImportMap = Record<
  string,
  (
    | ImportedObjectDefinition
    | ImportedQueryDefinition
    | ImportedEnumDefinition
  ) &
    Namespaced
>;

type EnumOrObject = ObjectDefinition | EnumDefinition;
type ImportedEnumOrObject = ImportedObjectDefinition | ImportedEnumDefinition;

// A transformation that converts all object definitions into
// imported object definitions
const extractObjectImportDependencies = (
  importsFound: ImportMap,
  rootTypeInfo: TypeInfo,
  namespace: string,
  uri: string
): TypeInfoTransforms => {
  const findImport = (
    def: GenericDefinition,
    namespaceType: string,
    rootTypes: EnumOrObject[],
    importedTypes: ImportedEnumOrObject[],
    kind: DefinitionKind
  ): ImportedEnumOrObject & Namespaced => {
    // Find this type's ObjectDefinition in the root type info
    let idx = rootTypes.findIndex((obj) => obj.type === def.type);
    let obj = undefined;

    if (idx === -1) {
      idx = importedTypes.findIndex((obj) => obj.type === def.type);
    } else {
      obj = rootTypes[idx];
    }

    if (idx === -1) {
      throw Error(
        `extractObjectImportDependencies: Cannot find the dependent type within the root type info.\n` +
          `Type: ${def.type}\nTypeInfo: ${JSON.stringify(
            rootTypeInfo
          )}\n${namespace}\n${JSON.stringify(Object.keys(importsFound))}`
      );
    } else if (obj === undefined) {
      obj = importedTypes[idx];
    }

    // Create the new ImportedObjectDefinition
    return {
      ...obj,
      name: null,
      required: null,
      type: namespaceType,
      __namespaced: true,
      kind,
      uri,
      namespace,
      nativeType: def.type,
    };
  };

  return {
    enter: {
      ObjectDefinition: (def: ObjectDefinition & Namespaced) => {
        if (def.__namespaced) {
          return def;
        }

        const namespaceType = appendNamespace(namespace, def.type);

        if (!importsFound[namespaceType]) {
          // Find the import
          const importFound = findImport(
            def,
            namespaceType,
            rootTypeInfo.objectTypes,
            rootTypeInfo.importedObjectTypes,
            DefinitionKind.ImportedObject
          ) as ImportedObjectDefinition;

          // Keep track of it
          importsFound[importFound.type] = importFound;

          // Traverse this newly added object
          visitObjectDefinition(importFound, {
            ...extractObjectImportDependencies(
              importsFound,
              rootTypeInfo,
              namespace,
              uri
            ),
            leave: {
              PropertyDefinition: (def: PropertyDefinition) => {
                populatePropertyType(def);
                return def;
              },
            },
          });
        }

        return def;
      },
      EnumDefinition: (def: EnumDefinition & Namespaced) => {
        if (def.__namespaced) {
          return def;
        }

        const namespaceType = appendNamespace(namespace, def.type);
        if (!importsFound[namespaceType]) {
          // Find the import
          const importFound = findImport(
            def,
            namespaceType,
            rootTypeInfo.enumTypes,
            rootTypeInfo.importedEnumTypes,
            DefinitionKind.ImportedEnum
          ) as ImportedEnumDefinition;

          // Keep track of it
          importsFound[importFound.type] = importFound;
        }

        return def;
      },
    },
  };
};

const namespaceTypes = (namespace: string): TypeInfoTransforms => ({
  enter: {
    ObjectDefinition: (def: ObjectDefinition & Namespaced) => {
      if (def.__namespaced) {
        return def;
      }

      return {
        ...def,
        type: appendNamespace(namespace, def.type),
        __namespaced: true,
      };
    },
    EnumDefinition: (def: EnumDefinition & Namespaced) => {
      if (def.__namespaced) {
        return def;
      }

      return {
        ...def,
        type: appendNamespace(namespace, def.type),
        __namespaced: true,
      };
    },
  },
  leave: {
    PropertyDefinition: (def: PropertyDefinition) => {
      populatePropertyType(def);
      return def;
    },
  },
});

function appendNamespace(namespace: string, str: string) {
  return `${namespace}_${str}`;
}

function addQueryImportsDirective(
  schema: string,
  externalImports: string[],
  mutation: boolean
): string {
  if (!externalImports.length) {
    return schema;
  }

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

async function resolveExternalImports(
  importsToResolve: ExternalImport[],
  resolveSchema: SchemaResolver,
  typeInfo: TypeInfo
): Promise<string[]> {
  // Keep track of all imported object type names
  const typesToImport: ImportMap = {};

  for (const importToResolve of importsToResolve) {
    const { uri, namespace, importedTypes } = importToResolve;

    // Resolve the schema
    const schema = await resolveSchema(uri);

    if (!schema) {
      throw Error(`Unable to resolve schema at "${uri}"`);
    }

    // Parse the schema into TypeInfo
    const extTypeInfo = parseSchema(schema);

    // For each imported type to resolve
    for (const importedType of importedTypes) {
      let extTypes: (
        | QueryDefinition
        | ObjectDefinition
        | EnumDefinition
      )[] = [];
      let visitorFunc: Function;
      let trueTypeKind: DefinitionKind;

      // If it's a query type
      if (importedType === "Query" || importedType === "Mutation") {
        extTypes = extTypeInfo.queryTypes;
        visitorFunc = visitQueryDefinition;
        trueTypeKind = DefinitionKind.ImportedQuery;
      } else if (
        importedType.endsWith("_Query") ||
        importedType.endsWith("_Mutation")
      ) {
        throw Error(
          `Cannot import an import's imported query type. Tried to import ${importedType} from ${uri}.`
        );
      } else {
        if (
          extTypeInfo.objectTypes.findIndex(
            (def) => def.type === importedType
          ) > -1
        ) {
          extTypes = extTypeInfo.objectTypes;
          visitorFunc = visitObjectDefinition;
          trueTypeKind = DefinitionKind.ImportedObject;
        } else if (
          extTypeInfo.importedObjectTypes.findIndex(
            (def) => def.type === importedType
          ) > -1
        ) {
          extTypes = extTypeInfo.importedObjectTypes;
          visitorFunc = visitObjectDefinition;
          trueTypeKind = DefinitionKind.ImportedObject;
        } else if (
          extTypeInfo.importedEnumTypes.findIndex(
            (def) => def.type === importedType
          ) > -1
        ) {
          extTypes = extTypeInfo.importedEnumTypes;
          visitorFunc = visitEnumDefinition;
          trueTypeKind = DefinitionKind.ImportedEnum;
        } else {
          extTypes = extTypeInfo.enumTypes;
          visitorFunc = visitEnumDefinition;
          trueTypeKind = DefinitionKind.ImportedEnum;
        }
      }

      // Find the type's definition in the schema's TypeInfo
      const type = extTypes.find((type) => type.type === importedType);

      if (!type) {
        throw Error(
          `Cannot find type "${importedType}" in the schema at ${uri}.\nFound: [ ${extTypes.map(
            (type) => type.type + " "
          )}]`
        );
      }

      const namespacedType = appendNamespace(namespace, importedType);

      // Continue if we've already imported this type
      if (typesToImport[namespacedType]) {
        continue;
      }

      // Append the base type to our TypeInfo
      typesToImport[namespacedType] = {
        ...type,
        name: null,
        required: null,
        type: namespacedType,
        kind: trueTypeKind,
        namespace,
        __namespaced: true,
        uri,
        nativeType: type.type,
      };

      // Extract all object dependencies
      visitorFunc(
        type,
        extractObjectImportDependencies(
          typesToImport,
          extTypeInfo,
          namespace,
          uri
        )
      );
    }

    // Add all imported types into the aggregate TypeInfo
    for (const importName of Object.keys(typesToImport)) {
      const importType = typesToImport[importName];
      let destArray:
        | ImportedObjectDefinition[]
        | ImportedQueryDefinition[]
        | ImportedEnumDefinition[];
      let append;

      if (importType.kind === DefinitionKind.ImportedObject) {
        destArray = typeInfo.importedObjectTypes;
        append = () => {
          const importDef = importType as ImportedObjectDefinition;
          // Namespace all object types
          typeInfo.importedObjectTypes.push(
            visitImportedObjectDefinition(importDef, namespaceTypes(namespace))
          );
        };
      } else if (importType.kind === DefinitionKind.ImportedQuery) {
        destArray = typeInfo.importedQueryTypes;
        append = () => {
          const importDef = importType as ImportedQueryDefinition;
          // Namespace all object types
          typeInfo.importedQueryTypes.push(
            visitImportedQueryDefinition(importDef, namespaceTypes(namespace))
          );
        };
      } else if (importType.kind === DefinitionKind.ImportedEnum) {
        destArray = typeInfo.importedEnumTypes;
        append = () => {
          typeInfo.importedEnumTypes.push(
            visitImportedEnumDefinition(
              importType as ImportedEnumDefinition,
              namespaceTypes(namespace)
            )
          );
        };
      } else {
        throw Error(
          `resolveExternalImports: This should never happen, unknown kind.\n${JSON.stringify(
            importType,
            null,
            2
          )}`
        );
      }

      const found =
        destArray.findIndex(
          (
            def:
              | ImportedObjectDefinition
              | ImportedQueryDefinition
              | ImportedEnumDefinition
          ) => def.type === importType.type
        ) > -1;

      if (!found) {
        append();
      }
    }
  }

  return Promise.resolve(Object.keys(typesToImport));
}

async function resolveLocalImports(
  importsToResolve: LocalImport[],
  resolveSchema: SchemaResolver,
  typeInfo: TypeInfo
): Promise<void> {
  for (const importToResolve of importsToResolve) {
    const { importedTypes, path } = importToResolve;

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

    // Keep track of all imported type names
    const typesToImport: Record<string, GenericDefinition> = {};

    for (const importedType of importedTypes) {
      if (importedType === "Query" || importedType === "Mutation") {
        throw Error(
          `Importing query types from local schemas is prohibited. Tried to import from ${path}.`
        );
      } else {
        let type: GenericDefinition | undefined;
        let visitorFunc: Function;

        if (
          localTypeInfo.objectTypes.findIndex(
            (type) => type.type === importedType
          ) > -1
        ) {
          visitorFunc = visitObjectDefinition;
          type = localTypeInfo.objectTypes.find(
            (type) => type.type === importedType
          );
        } else {
          visitorFunc = visitEnumDefinition;
          type = localTypeInfo.enumTypes.find(
            (type) => type.type === importedType
          );
        }

        if (!type) {
          throw Error(
            `Cannot find type "${importedType}" in the schema at ${path}.\nFound: [ ${localTypeInfo.objectTypes.map(
              (type) => type.type + " "
            )}]`
          );
        }

        typesToImport[type.type] = type;

        const findImport = (
          def: GenericDefinition,
          rootTypes: EnumOrObject[]
        ) => {
          // Skip objects that we've already processed
          if (typesToImport[def.type]) {
            return def;
          }

          // Find the ObjectDefinition
          const idx = rootTypes.findIndex((obj) => obj.type === def.type);

          if (idx === -1) {
            throw Error(
              `resolveLocalImports: Cannot find the requested type within the TypeInfo.\n` +
                `Type: ${def.type}\nTypeInfo: ${JSON.stringify(localTypeInfo)}`
            );
          }

          typesToImport[def.type] = {
            ...rootTypes[idx],
            name: null,
            required: null,
          };
          return def;
        };

        visitorFunc(type, {
          enter: {
            ObjectDefinition: (def: ObjectDefinition) => {
              return findImport(def, localTypeInfo.objectTypes);
            },
            EnumDefinition: (def: EnumDefinition) => {
              return findImport(def, localTypeInfo.enumTypes);
            },
          },
        });
      }
    }

    // Add all imported types into the aggregate TypeInfo
    for (const importType of Object.keys(typesToImport)) {
      if (isKind(typesToImport[importType], DefinitionKind.Object)) {
        if (
          typeInfo.objectTypes.findIndex((def) => def.type === importType) ===
          -1
        ) {
          typeInfo.objectTypes.push(
            typesToImport[importType] as ObjectDefinition
          );
        }
      } else {
        if (
          typeInfo.enumTypes.findIndex((def) => def.type === importType) === -1
        ) {
          typeInfo.enumTypes.push(typesToImport[importType] as EnumDefinition);
        }
      }
    }
  }
}
