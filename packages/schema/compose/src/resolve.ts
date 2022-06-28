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
import { parseExternalImports, parseLocalImports, parseUse } from "./parse";
import { renderSchema } from "./render";
import { addHeader } from "./templates/header.mustache";
import { checkDuplicateEnvProperties } from "./env";

import {
  TypeInfo,
  parseSchema,
  ObjectDefinition,
  ImportedObjectDefinition,
  ModuleDefinition,
  TypeInfoTransforms,
  visitObjectDefinition,
  visitModuleDefinition,
  visitEnvDefinition,
  ImportedModuleDefinition,
  DefinitionKind,
  visitImportedModuleDefinition,
  visitImportedObjectDefinition,
  ImportedEnumDefinition,
  EnumDefinition,
  visitEnumDefinition,
  visitImportedEnumDefinition,
  GenericDefinition,
  isKind,
  header,
  InterfaceImplementedDefinition,
  ObjectRef,
  EnumRef,
  isEnvType,
  createImportedObjectDefinition,
  createImportedEnumDefinition,
  createImportedModuleDefinition,
  createInterfaceDefinition,
  createCapability,
  ModuleCapability,
  createEnvDefinition,
  createModuleDefinition,
  EnvDefinition,
  createImportedEnvDefinition,
  ImportedEnvDefinition,
  visitImportedEnvDefinition,
  isImportedEnvType,
  isImportedModuleType,
} from "@polywrap/schema-parse";

type ImplementationWithInterfaces = {
  typeName: string;
  interfaces: string[];
};

const TYPE_NAME_REGEX = `[a-zA-Z0-9_]+`;

export async function resolveUseStatements(
  schema: string,
  schemaPath: string,
  typeInfo: TypeInfo
): Promise<ModuleCapability[]> {
  const useKeywordCapture = /^[#]*["{3}]*use[ \n\t]/gm;
  const useCapture = /[#]*["{3}]*use[ \n\t]*{([a-zA-Z0-9_, \n\t]+)}[ \n\t]*for[ \n\t]*(\w+)[ \n\t]/g;

  const keywords = [...schema.matchAll(useKeywordCapture)];
  const useStatements = [...schema.matchAll(useCapture)];

  if (keywords.length !== useStatements.length) {
    throw Error(
      `Invalid use statement found in file ${schemaPath}.\nPlease use one of the following syntaxes...\n${SYNTAX_REFERENCE}`
    );
  }

  const importedModuleByNamespace: Record<
    string,
    ImportedModuleDefinition
  > = {};

  typeInfo.importedModuleTypes.forEach((value) => {
    importedModuleByNamespace[value.namespace] = value;
  });

  // TODO: come back to this
  const capabilitiesExt: ModuleCapability[] = [];

  const parsedUses = parseUse(useStatements);
  for (const parsedUse of parsedUses) {
    const importedModule = importedModuleByNamespace[parsedUse.namespace];
    if (!importedModule) {
      throw Error(`Invalid use statement: namespace used hasn't been imported`);
    }

    const capabilities = parsedUse.usedTypes
      .map((type) => {
        capabilitiesExt.push({
          type,
          uri: importedModule.uri,
          namespace: parsedUse.namespace,
        });
        return createCapability({ type, enabled: true });
      })
      .reduce((o1, o2) => ({ ...o1, ...o2 }));

    typeInfo.interfaceTypes.push(
      createInterfaceDefinition({
        type: parsedUse.namespace,
        uri: importedModule.uri,
        namespace: parsedUse.namespace,
        capabilities: capabilities,
      })
    );
  }
  return capabilitiesExt;
}

export async function resolveImportsAndParseSchemas(
  schema: string,
  schemaPath: string,
  resolvers: SchemaResolvers,
  noValidate = false
): Promise<TypeInfo> {
  const importKeywordCapture = /^#+["{3}]*import\s/gm;
  const externalImportCapture = /#+["{3}]*import\s*(?:({[^}]+}|\*))\s*into\s*(\w+?)\s*from\s*[\"'`]([^\"'`\s]+)[\"'`]/g;
  const localImportCapture = /#+["{3}]*import\s*(?:({[^}]+}|\*))\s*from\s*[\"'`]([^\"'`\s]+)[\"'`]/g;

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

  const interfaceCapture = new RegExp(
    `type\\s+${TYPE_NAME_REGEX}\\s+implements\\s([^{]*){`,
    "g"
  );
  const implementInterfaceStatments = [...schema.matchAll(interfaceCapture)];

  const implementationsWithInterfaces = parseInterfaces(
    implementInterfaceStatments
  );

  const externalImportsToResolve: ExternalImport[] = parseExternalImports(
    externalImportStatements
  );

  const localImportsToResolve: LocalImport[] = parseLocalImports(
    localImportStatments,
    schemaPath
  );

  const subTypeInfo: TypeInfo = {
    objectTypes: [],
    enumTypes: [],
    interfaceTypes: [],
    importedEnumTypes: [],
    importedObjectTypes: [],
    importedModuleTypes: [],
    importedEnvTypes: [],
  };

  const externalImports = await resolveExternalImports(
    externalImportsToResolve,
    resolvers.external,
    subTypeInfo
  );

  await resolveLocalImports(
    localImportsToResolve,
    resolvers.local,
    subTypeInfo,
    resolvers
  );

  const capabilitiesByModule = await resolveUseStatements(
    schema,
    schemaPath,
    subTypeInfo
  );

  // Remove all import statements
  let newSchema = schema
    .replace(externalImportCapture, "")
    .replace(localImportCapture, "");

  // Remove all non documentation comments
  newSchema = newSchema.replace(/#[^\n]*\n/g, "");

  // Add the @imports directive
  newSchema = addModuleImportsDirective(newSchema, externalImports);

  // Add the @capability directive
  newSchema = addCapabilityDirective(newSchema, capabilitiesByModule);

  // Combine the new schema with the subTypeInfo
  newSchema = header + newSchema + renderSchema(subTypeInfo, false);

  newSchema = resolveInterfaces(newSchema, implementationsWithInterfaces);

  // Replace types that have empty curly brackets with types that have no curly brackets
  // because GraphQL parser doesn't support empty curly brackets but supports no curly brackets
  newSchema = newSchema.replace(
    new RegExp(`(type\\s+${TYPE_NAME_REGEX}[^{]*){\\s*}`, "g"),
    "$1"
  );

  // Parse the newly formed schema
  const typeInfo = parseSchema(newSchema, { noValidate });

  return typeInfo;
}

interface Namespaced {
  __namespaced?: boolean;
}

type ImportMap = Record<
  string,
  (
    | ImportedObjectDefinition
    | ImportedModuleDefinition
    | ImportedEnumDefinition
  ) &
    Namespaced
>;

type EnumOrObjectOrEnv = ObjectDefinition | EnumDefinition | EnvDefinition;
type ImportedEnumOrObjectOrEnv =
  | ImportedObjectDefinition
  | ImportedEnumDefinition
  | ImportedEnvDefinition;

// A transformation that converts all object definitions into
// imported object definitions
const extractObjectImportDependencies = (
  importsFound: ImportMap,
  rootTypeInfo: TypeInfo,
  namespace: string,
  uri: string
): TypeInfoTransforms => {
  const findImport = (
    type: string,
    namespaceType: string,
    rootTypes: EnumOrObjectOrEnv[],
    importedTypes: ImportedEnumOrObjectOrEnv[],
    kind: DefinitionKind
  ): ImportedEnumOrObjectOrEnv & Namespaced => {
    // Find this type's ObjectDefinition in the root type info
    let idx = rootTypes.findIndex((obj) => obj.type === type);
    let obj = undefined;

    if (idx === -1) {
      idx = importedTypes.findIndex((obj) => obj.type === type);
    } else {
      obj = rootTypes[idx];
    }

    if (idx === -1) {
      console.log(rootTypeInfo);
      throw Error(
        `extractObjectImportDependencies: Cannot find the dependent type within the root type info.\n` +
          `Type: ${type}\nTypeInfo: ${JSON.stringify(
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
      nativeType: type,
    };
  };

  return {
    enter: {
      ObjectRef: (def: ObjectRef & Namespaced) => {
        if (def.__namespaced) {
          return def;
        }

        const type = def.type;

        const namespaceType = appendNamespace(namespace, type);

        if (!importsFound[namespaceType]) {
          if (isEnvType(type)) {
            const importFound = findImport(
              type,
              namespaceType,
              rootTypeInfo.envType ? [rootTypeInfo.envType] : [],
              rootTypeInfo.importedEnvTypes,
              DefinitionKind.ImportedObject
            ) as ImportedEnvDefinition;

            // Keep track of it
            importsFound[importFound.type] = importFound;

            // Traverse this newly added object
            visitImportedEnvDefinition(importFound, {
              ...extractObjectImportDependencies(
                importsFound,
                rootTypeInfo,
                namespace,
                uri
              ),
            });
          } else {
            const importFound = findImport(
              type,
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
            });
          }
        }

        return def;
      },
      InterfaceImplementedDefinition: (
        def: InterfaceImplementedDefinition & Namespaced
      ) => {
        if (def.__namespaced) {
          return def;
        }

        const type = def.type;

        const namespaceType = appendNamespace(namespace, type);

        if (!importsFound[namespaceType]) {
          if (isEnvType(type)) {
            const importFound = findImport(
              type,
              namespaceType,
              rootTypeInfo.envType ? [rootTypeInfo.envType] : [],
              rootTypeInfo.importedEnvTypes,
              DefinitionKind.ImportedObject
            ) as ImportedEnvDefinition;

            // Keep track of it
            importsFound[importFound.type] = importFound;

            // Traverse this newly added object
            visitEnvDefinition(importFound, {
              ...extractObjectImportDependencies(
                importsFound,
                rootTypeInfo,
                namespace,
                uri
              ),
            });
          } else {
            const importFound = findImport(
              type,
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
            });
          }
        }

        return def;
      },
      EnumRef: (def: EnumRef & Namespaced) => {
        if (def.__namespaced) {
          return def;
        }

        const namespaceType = appendNamespace(namespace, def.type);
        if (!importsFound[namespaceType]) {
          // Find the import
          const importFound = findImport(
            def.type,
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
    ObjectRef: (def: ObjectRef & Namespaced) => {
      if (def.__namespaced) {
        return def;
      }

      return {
        ...def,
        type: appendNamespace(namespace, def.type),
        __namespaced: true,
      };
    },
    InterfaceImplementedDefinition: (
      def: InterfaceImplementedDefinition & Namespaced
    ) => {
      if (def.__namespaced) {
        return def;
      }

      return {
        ...def,
        type: appendNamespace(namespace, def.type),
        __namespaced: true,
      };
    },
    EnumRef: (def: EnumRef & Namespaced) => {
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
});

function appendNamespace(namespace: string, str: string) {
  return `${namespace}_${str}`;
}

function addModuleImportsDirective(
  schema: string,
  externalImports: string[]
): string {
  if (!externalImports.length) {
    return schema;
  }

  let result = schema;

  const modifySchema = () => {
    // Append the @imports(...) directive to the module type
    const typeCapture = /type\s+Module\s+([^{]*)\s*{/g;

    const importedTypes = `${externalImports
      .map((type) => `\"${type}\"`)
      .join(",\n    ")}`;

    const replacementModuleStr = `type Module $1@imports(
    types: [
      ${importedTypes}
    ]
    ) {`;

    return result.replace(typeCapture, replacementModuleStr);
  };

  result = modifySchema();

  return result;
}

function addCapabilityDirective(
  schema: string,
  capabilities: ModuleCapability[]
): string {
  if (!capabilities.length) {
    return schema;
  }

  capabilities.forEach((capability) => {
    const typeCapture = /type[ \n\t]+Module[ \n\t]+([^{]*)[ \n\t]*{/g;
    const replacementModuleStr = `type Module $1@capability(
type: "${capability.type}",
uri: "${capability.uri}",
namespace: "${capability.namespace}"
) {`;

    schema = schema.replace(typeCapture, replacementModuleStr);
  });

  return schema;
}

function parseInterfaces(
  implementInterfaceStatments: RegExpMatchArray[]
): ImplementationWithInterfaces[] {
  const implementationsWithInterfaces: ImplementationWithInterfaces[] = [];

  for (const implementMatch of implementInterfaceStatments) {
    const implementStr = implementMatch[1].trim();
    const typeCapture = new RegExp(`type\\s+(${TYPE_NAME_REGEX})\\s+`, "g");

    const typeNameMatches = typeCapture.exec(implementMatch[0]);

    if (!typeNameMatches) {
      continue;
    }

    const typeName = typeNameMatches[1];

    const interfaces = [
      ...implementStr.matchAll(new RegExp(`(${TYPE_NAME_REGEX})(&\s+)*`, "g")),
    ].map((x) => x[0]);

    implementationsWithInterfaces.push({
      typeName,
      interfaces,
    });
  }

  return implementationsWithInterfaces;
}

function resolveInterfaces(
  schema: string,
  implementationsWithInterfaces: ImplementationWithInterfaces[]
): string {
  const removeComments = (body: string) => {
    const bodyWithoutComments = body.replace(/"""[^"]*"""\s*/g, "");
    return bodyWithoutComments;
  };

  if (!implementationsWithInterfaces.length) {
    return schema;
  }

  const getAllUniqueInterfaces = (): string[] => {
    const allIntefaces = implementationsWithInterfaces
      .map((x) => x.interfaces)
      .reduce((acc, x) => acc.concat(x), []);

    return [...new Set(allIntefaces)];
  };

  const allInterfaces = getAllUniqueInterfaces();
  const interfacesWithBodies: { name: string; body: string }[] = [];

  const typeCapture = new RegExp(
    `type\\s+(${TYPE_NAME_REGEX})[^{]+{([^}]*)}`,
    "g"
  );
  const typeMatches = [...schema.matchAll(typeCapture)];

  for (const interfaceName of allInterfaces) {
    const match = typeMatches.find((x) => x[1] === interfaceName);

    if (!match) {
      continue;
    }

    let body = match[2];
    if (!body) {
      continue;
    }

    body = removeComments(body);

    interfacesWithBodies.push({
      name: interfaceName,
      body: body,
    });
  }

  for (const implementationWithInterfaces of implementationsWithInterfaces) {
    const implementationTypeCapture = new RegExp(
      `(type\\s+${implementationWithInterfaces.typeName}\\s+[^{]*){([^}]*)}`
    );

    const bodiesOfInterfaces = implementationWithInterfaces.interfaces.map(
      (interfaceName) => {
        return interfacesWithBodies
          .find((iwb) => iwb.name === interfaceName)
          ?.body.trim();
      }
    );

    const bodiesOfInterfacesStr = bodiesOfInterfaces
      .filter((x) => x)
      .reduce((acc: string, x: string) => acc + "\n" + x, "");

    schema = schema.replace(
      implementationTypeCapture,
      `$1{$2${bodiesOfInterfacesStr}\n}`
    );
  }

  return schema;
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

    let extTypesToImport = importedTypes;

    // If the importedTypes array contains the catch-all "*"
    // go ahead and add all extTypeInfo types to the importedTypes array
    if (extTypesToImport.indexOf("*") > -1) {
      extTypesToImport = [
        ...extTypeInfo.objectTypes.map((x) => x.type),
        ...extTypeInfo.enumTypes.map((x) => x.type),
      ];

      if (extTypeInfo.moduleType) {
        extTypesToImport.push(extTypeInfo.moduleType.type);
      }

      if (extTypeInfo.envType) {
        extTypesToImport.push(extTypeInfo.envType.type);
      }
    }

    // For each imported type to resolve
    for (const importedType of extTypesToImport) {
      let extTypes: (
        | ModuleDefinition
        | ObjectDefinition
        | EnumDefinition
      )[] = [];
      let visitorFunc: Function | undefined;
      let trueType:
        | ImportedModuleDefinition
        | ImportedObjectDefinition
        | ImportedEnumDefinition
        | undefined;

      // If it's a module type
      if (importedType === "Module") {
        if (!extTypeInfo.moduleType) {
          extTypeInfo.moduleType = createModuleDefinition({});
        }

        extTypes = [extTypeInfo.moduleType as ModuleDefinition];
        visitorFunc = visitModuleDefinition;
        const type = extTypeInfo.moduleType as ModuleDefinition;
        trueType = {
          ...createImportedModuleDefinition({
            ...type,
            required: undefined,
            uri,
            nativeType: type.type,
            namespace,
          }),
          methods: type.methods,
        };
      } else if (isImportedModuleType(importedType)) {
        throw Error(
          `Cannot import an import's imported module type. Tried to import ${importedType} from ${uri}.`
        );
      } else if (isEnvType(importedType)) {
        if (!extTypeInfo.envType) {
          throw new Error(
            `Tried to import env type from ${uri} but it doesn't exist.`
          );
        }

        extTypes = [extTypeInfo.envType];
        visitorFunc = visitEnvDefinition;
        const type = extTypeInfo.envType;
        trueType = {
          ...createImportedEnvDefinition({
            ...type,
            name: undefined,
            required: undefined,
            uri,
            nativeType: type.type,
            namespace,
          }),
          properties: type.properties,
        };
      } else if (isImportedEnvType(importedType)) {
        throw Error(
          `Cannot import an import's imported env type. Tried to import ${importedType} from ${uri}.`
        );
      } else {
        const objIdx = extTypeInfo.objectTypes.findIndex(
          (def) => def.type === importedType
        );
        const impObjIdx =
          objIdx === -1 &&
          extTypeInfo.importedObjectTypes.findIndex(
            (def) => def.type === importedType
          );
        const enumIdx =
          impObjIdx === -1 &&
          extTypeInfo.enumTypes.findIndex((def) => def.type === importedType);
        const impEnumIdx =
          enumIdx === -1 &&
          extTypeInfo.importedEnumTypes.findIndex(
            (def) => def.type === importedType
          );

        if (objIdx > -1) {
          extTypes = extTypeInfo.objectTypes;
          visitorFunc = visitObjectDefinition;
          const type = extTypeInfo.objectTypes[objIdx];
          trueType = {
            ...createImportedObjectDefinition({
              ...type,
              type: appendNamespace(namespace, importedType),
              name: undefined,
              required: undefined,
              uri,
              nativeType: type.type,
              namespace,
            }),
            properties: type.properties,
          };
        } else if (impObjIdx !== false && impObjIdx > -1) {
          extTypes = extTypeInfo.importedObjectTypes;
          visitorFunc = visitObjectDefinition;
          const type = extTypeInfo.importedObjectTypes[impObjIdx];
          trueType = {
            ...createImportedObjectDefinition({
              ...type,
              type: appendNamespace(namespace, importedType),
              name: undefined,
              required: undefined,
              uri,
              nativeType: type.type,
              namespace,
            }),
            properties: type.properties,
          };
        } else if (enumIdx !== false && enumIdx > -1) {
          extTypes = extTypeInfo.enumTypes;
          visitorFunc = visitEnumDefinition;
          const type = extTypeInfo.enumTypes[enumIdx];
          trueType = createImportedEnumDefinition({
            ...type,
            type: appendNamespace(namespace, importedType),
            name: undefined,
            required: undefined,
            uri,
            nativeType: type.type,
            namespace,
          });
        } else if (impEnumIdx !== false && impEnumIdx > -1) {
          extTypes = extTypeInfo.importedEnumTypes;
          visitorFunc = visitEnumDefinition;
          const type = extTypeInfo.importedEnumTypes[impEnumIdx];
          trueType = createImportedEnumDefinition({
            ...type,
            type: appendNamespace(namespace, importedType),
            name: undefined,
            required: undefined,
            uri,
            nativeType: type.type,
            namespace,
          });
        }
      }

      if (!trueType) {
        throw Error(
          `Cannot find type "${importedType}" in the schema at ${uri}.\nFound: [ ${extTypes.map(
            (type) => type.type + " "
          )}]`
        );
      }

      if (!visitorFunc) {
        throw Error(`visitorFunc has not been set, this should never happen.`);
      }

      const namespacedType = appendNamespace(namespace, importedType);

      // Continue if we've already imported this type
      if (typesToImport[namespacedType]) {
        continue;
      }

      // Append the base type to our TypeInfo
      typesToImport[namespacedType] = {
        ...trueType,
        __namespaced: true,
      };

      // Extract all object dependencies
      visitorFunc(
        trueType,
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
        | ImportedModuleDefinition[]
        | ImportedEnumDefinition[]
        | ImportedEnvDefinition[];
      let append;

      if (importType.kind === DefinitionKind.ImportedEnv) {
        destArray = typeInfo.importedEnvTypes;
        append = () => {
          const importDef = importType as ImportedEnvDefinition;
          typeInfo.importedEnvTypes.push(
            visitImportedEnvDefinition(importDef, namespaceTypes(namespace))
          );
        };
      } else if (importType.kind === DefinitionKind.ImportedObject) {
        destArray = typeInfo.importedObjectTypes;
        append = () => {
          const importDef = importType as ImportedObjectDefinition;
          typeInfo.importedObjectTypes.push(
            visitImportedObjectDefinition(importDef, namespaceTypes(namespace))
          );
        };
      } else if (importType.kind === DefinitionKind.ImportedModule) {
        destArray = typeInfo.importedModuleTypes;
        append = () => {
          const importDef = importType as ImportedModuleDefinition;
          typeInfo.importedModuleTypes.push(
            visitImportedModuleDefinition(importDef, namespaceTypes(namespace))
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
              | ImportedModuleDefinition
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
  typeInfo: TypeInfo,
  resolvers: SchemaResolvers
): Promise<void> {
  for (const importToResolve of importsToResolve) {
    const { importedTypes, path } = importToResolve;

    // Resolve the schema
    let schema = await resolveSchema(path);

    if (!schema) {
      throw Error(`Unable to resolve schema at "${path}"`);
    }

    // Make sure the schema has the Polywrap header
    if (schema.indexOf("### Polywrap Header START ###") === -1) {
      schema = addHeader(schema);
    }

    // Parse the schema into TypeInfo
    const localTypeInfo = await resolveImportsAndParseSchemas(
      schema,
      path,
      resolvers,
      true
    );

    let extTypesToImport = importedTypes;

    // If the importedTypes array contains the catch-all "*"
    // go ahead and add all extTypeInfo types to the importedTypes array
    if (extTypesToImport.indexOf("*") > -1) {
      extTypesToImport = [
        ...localTypeInfo.objectTypes.map((x) => x.type),
        ...localTypeInfo.enumTypes.map((x) => x.type),
      ];

      if (localTypeInfo.moduleType) {
        extTypesToImport.push(localTypeInfo.moduleType.type);
      }
    }

    // Keep track of all imported type names
    const typesToImport: Record<string, ObjectDefinition | EnumDefinition> = {};

    for (const importedType of extTypesToImport) {
      if (importedType === "Module") {
        throw Error(
          `Importing module types from local schemas is prohibited. Tried to import from ${path}.`
        );
      }

      let type: ObjectDefinition | EnumDefinition | undefined;
      let visitorFunc: Function;

      if (isEnvType(importedType)) {
        visitorFunc = visitEnvDefinition;
        type = localTypeInfo.envType;
      } else {
        const objectIdx = localTypeInfo.objectTypes.findIndex(
          (type) => type.type === importedType
        );

        const enumIdx =
          objectIdx === -1 &&
          localTypeInfo.enumTypes.findIndex(
            (type) => type.type === importedType
          );

        if (objectIdx > -1) {
          visitorFunc = visitObjectDefinition;
          type = localTypeInfo.objectTypes[objectIdx];
        } else if (enumIdx > -1) {
          visitorFunc = visitEnumDefinition;
          type = localTypeInfo.enumTypes.find(
            (type) => type.type === importedType
          );
        }
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
        rootTypes: EnumOrObjectOrEnv[]
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

        const objectDefinition = rootTypes[idx];

        if (!visitedTypes[objectDefinition.type]) {
          if (objectDefinition.kind !== DefinitionKind.Enum) {
            visitedTypes[objectDefinition.type] = true;
            visitType(objectDefinition);
          }
        }

        typesToImport[def.type] = {
          ...objectDefinition,
          name: null,
          required: null,
        };
        return def;
      };

      const visitedTypes: Record<string, boolean> = {};

      const visitType = (type: GenericDefinition) => {
        visitorFunc(type, {
          enter: {
            ObjectRef: (def: ObjectRef) => {
              return findImport(def, [
                ...localTypeInfo.objectTypes,
                ...localTypeInfo.importedObjectTypes,
              ]);
            },
            EnumRef: (def: EnumRef) => {
              return findImport(def, [
                ...localTypeInfo.enumTypes,
                ...localTypeInfo.importedEnumTypes,
              ]);
            },
            InterfaceImplementedDefinition: (
              def: InterfaceImplementedDefinition
            ) => {
              return findImport(def, [
                ...localTypeInfo.objectTypes,
                ...localTypeInfo.importedObjectTypes,
              ]);
            },
          },
        });
      };

      visitedTypes[type.type] = true;
      visitType(type);
    }

    // Add all imported types into the aggregate TypeInfo
    for (const importType of Object.keys(typesToImport)) {
      if (isKind(typesToImport[importType], DefinitionKind.Env)) {
        if (!typeInfo.envType) {
          typeInfo.envType = createEnvDefinition({});
        }

        const sharedEnv = localTypeInfo.envType as EnvDefinition;

        checkDuplicateEnvProperties(typeInfo.envType, sharedEnv.properties);

        typeInfo.envType.properties.push(...sharedEnv.properties);
      } else if (
        isKind(typesToImport[importType], DefinitionKind.ImportedObject)
      ) {
        if (
          typeInfo.importedObjectTypes.findIndex(
            (def) => def.type === importType
          ) === -1
        ) {
          typeInfo.importedObjectTypes.push(
            typesToImport[importType] as ImportedObjectDefinition
          );
        }
      } else if (isKind(typesToImport[importType], DefinitionKind.Object)) {
        if (
          typeInfo.objectTypes.findIndex((def) => def.type === importType) ===
          -1
        ) {
          typeInfo.objectTypes.push(
            typesToImport[importType] as ObjectDefinition
          );
        }
      } else if (
        isKind(typesToImport[importType], DefinitionKind.ImportedEnum)
      ) {
        if (
          typeInfo.importedEnumTypes.findIndex(
            (def) => def.type === importType
          ) === -1
        ) {
          typeInfo.importedEnumTypes.push(
            typesToImport[importType] as ImportedEnumDefinition
          );
        }
      } else if (isKind(typesToImport[importType], DefinitionKind.Enum)) {
        if (
          typeInfo.enumTypes.findIndex((def) => def.type === importType) === -1
        ) {
          typeInfo.enumTypes.push(typesToImport[importType] as EnumDefinition);
        }
      }
    }
  }
}
