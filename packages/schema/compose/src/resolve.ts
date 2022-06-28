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
  Abi,
  parseSchema,
  ObjectDefinition,
  ImportedObjectDefinition,
  ModuleDefinition,
  AbiTransforms,
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
  envTypes,
  createObjectDefinition,
  createModuleDefinition,
  isClientEnvType,
} from "@polywrap/schema-parse";

type ImplementationWithInterfaces = {
  typeName: string;
  interfaces: string[];
};

const TYPE_NAME_REGEX = `[a-zA-Z0-9_]+`;

export async function resolveUseStatements(
  schema: string,
  schemaPath: string,
  abi: Abi
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

  abi.importedModuleTypes.forEach((value) => {
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

    abi.interfaceTypes.push(
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
): Promise<Abi> {
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

  const subAbi: Abi = {
    objectTypes: [],
    enumTypes: [],
    interfaceTypes: [],
    importedEnumTypes: [],
    importedObjectTypes: [],
    importedModuleTypes: [],
    envType: createEnvDefinition({}),
  };

  const externalImports = await resolveExternalImports(
    externalImportsToResolve,
    resolvers.external,
    subAbi
  );

  await resolveLocalImports(
    localImportsToResolve,
    resolvers.local,
    subAbi,
    resolvers
  );

  const capabilitiesByModule = await resolveUseStatements(
    schema,
    schemaPath,
    subAbi
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

  // Combine the new schema with the subAbi
  newSchema = header + newSchema + renderSchema(subAbi, false);

  newSchema = resolveInterfaces(newSchema, implementationsWithInterfaces);

  // Replace types that have empty curly brackets with types that have no curly brackets
  // because GraphQL parser doesn't support empty curly brackets but supports no curly brackets
  newSchema = newSchema.replace(
    new RegExp(`(type\\s+${TYPE_NAME_REGEX}[^{]*){\\s*}`, "g"),
    "$1"
  );

  // Parse the newly formed schema
  const abi = parseSchema(newSchema, { noValidate });

  return abi;
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

type EnumOrObject = ObjectDefinition | EnumDefinition;
type ImportedEnumOrObject = ImportedObjectDefinition | ImportedEnumDefinition;

// A transformation that converts all object definitions into
// imported object definitions
const extractObjectImportDependencies = (
  importsFound: ImportMap,
  rootAbi: Abi,
  namespace: string,
  uri: string
): AbiTransforms => {
  const findImport = (
    type: string,
    namespaceType: string,
    rootTypes: EnumOrObject[],
    importedTypes: ImportedEnumOrObject[],
    kind: DefinitionKind
  ): ImportedEnumOrObject & Namespaced => {
    // Find this type's ObjectDefinition in the root type info
    let idx = rootTypes.findIndex((obj) => obj.type === type);
    let obj = undefined;

    if (idx === -1) {
      idx = importedTypes.findIndex((obj) => obj.type === type);
    } else {
      obj = rootTypes[idx];
    }

    if (idx === -1) {
      throw Error(
        `extractObjectImportDependencies: Cannot find the dependent type within the root type info.\n` +
          `Type: ${type}\nAbi: ${JSON.stringify(
            rootAbi
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
          // Find the import
          const importFound = findImport(
            type,
            namespaceType,
            rootAbi.objectTypes,
            rootAbi.importedObjectTypes,
            DefinitionKind.ImportedObject
          ) as ImportedObjectDefinition;

          // Keep track of it
          importsFound[importFound.type] = importFound;

          // Traverse this newly added object
          visitObjectDefinition(importFound, {
            ...extractObjectImportDependencies(
              importsFound,
              rootAbi,
              namespace,
              uri
            ),
          });
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
          // Find the import
          const importFound = findImport(
            type,
            namespaceType,
            rootAbi.objectTypes,
            rootAbi.importedObjectTypes,
            DefinitionKind.ImportedObject
          ) as ImportedObjectDefinition;

          // Keep track of it
          importsFound[importFound.type] = importFound;

          // Traverse this newly added object
          visitObjectDefinition(importFound, {
            ...extractObjectImportDependencies(
              importsFound,
              rootAbi,
              namespace,
              uri
            ),
          });
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
            rootAbi.enumTypes,
            rootAbi.importedEnumTypes,
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

const namespaceTypes = (namespace: string): AbiTransforms => ({
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
  abi: Abi
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

    // Parse the schema into Abi
    const extAbi = parseSchema(schema);

    let extTypesToImport = importedTypes;

    // If the importedTypes array contains the catch-all "*"
    // go ahead and add all extAbi types to the importedTypes array
    if (extTypesToImport.indexOf("*") > -1) {
      extTypesToImport = [
        ...extAbi.objectTypes.map((x) => x.type),
        ...extAbi.enumTypes.map((x) => x.type),
      ];

      if (extAbi.moduleType) {
        extTypesToImport.push(extAbi.moduleType.type);
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
        if (!extAbi.moduleType) {
          extAbi.moduleType = createModuleDefinition({});
        }

        extTypes = [extAbi.moduleType as ModuleDefinition];
        visitorFunc = visitModuleDefinition;
        const type = extAbi.moduleType as ModuleDefinition;
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
      } else if (importedType.endsWith("_Module")) {
        throw Error(
          `Cannot import an import's imported module type. Tried to import ${importedType} from ${uri}.`
        );
      } else {
        const objIdx = extAbi.objectTypes.findIndex(
          (def) => def.type === importedType
        );
        const impObjIdx =
          objIdx === -1 &&
          extAbi.importedObjectTypes.findIndex(
            (def) => def.type === importedType
          );
        const enumIdx =
          impObjIdx === -1 &&
          extAbi.enumTypes.findIndex((def) => def.type === importedType);
        const impEnumIdx =
          enumIdx === -1 &&
          extAbi.importedEnumTypes.findIndex(
            (def) => def.type === importedType
          );

        if (objIdx > -1) {
          extTypes = extAbi.objectTypes;
          visitorFunc = visitObjectDefinition;
          const type = extAbi.objectTypes[objIdx];
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
          extTypes = extAbi.importedObjectTypes;
          visitorFunc = visitObjectDefinition;
          const type = extAbi.importedObjectTypes[impObjIdx];
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
          extTypes = extAbi.enumTypes;
          visitorFunc = visitEnumDefinition;
          const type = extAbi.enumTypes[enumIdx];
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
          extTypes = extAbi.importedEnumTypes;
          visitorFunc = visitEnumDefinition;
          const type = extAbi.importedEnumTypes[impEnumIdx];
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

      // Append the base type to our Abi
      typesToImport[namespacedType] = {
        ...trueType,
        __namespaced: true,
      };

      // Extract all object dependencies
      visitorFunc(
        trueType,
        extractObjectImportDependencies(
          typesToImport,
          extAbi,
          namespace,
          uri
        )
      );
    }

    // Add all imported types into the aggregate Abi
    for (const importName of Object.keys(typesToImport)) {
      const importType = typesToImport[importName];
      let destArray:
        | ImportedObjectDefinition[]
        | ImportedModuleDefinition[]
        | ImportedEnumDefinition[];
      let append;

      if (importType.kind === DefinitionKind.ImportedObject) {
        destArray = abi.importedObjectTypes;
        append = () => {
          const importDef = importType as ImportedObjectDefinition;
          // Namespace all object types
          abi.importedObjectTypes.push(
            visitImportedObjectDefinition(importDef, namespaceTypes(namespace))
          );
        };
      } else if (importType.kind === DefinitionKind.ImportedModule) {
        destArray = abi.importedModuleTypes;
        append = () => {
          const importDef = importType as ImportedModuleDefinition;
          // Namespace all object types
          abi.importedModuleTypes.push(
            visitImportedModuleDefinition(importDef, namespaceTypes(namespace))
          );
        };
      } else if (importType.kind === DefinitionKind.ImportedEnum) {
        destArray = abi.importedEnumTypes;
        append = () => {
          abi.importedEnumTypes.push(
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
  abi: Abi,
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

    // Parse the schema into Abi
    const localAbi = await resolveImportsAndParseSchemas(
      schema,
      path,
      resolvers,
      true
    );

    let extTypesToImport = importedTypes;

    // If the importedTypes array contains the catch-all "*"
    // go ahead and add all extAbi types to the importedTypes array
    if (extTypesToImport.indexOf("*") > -1) {
      extTypesToImport = [
        ...localAbi.objectTypes.map((x) => x.type),
        ...localAbi.enumTypes.map((x) => x.type),
      ];

      if (localAbi.moduleType) {
        extTypesToImport.push(localAbi.moduleType.type);
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
        type = isClientEnvType(importedType)
          ? localAbi.envType.client
          : localAbi.envType.sanitized;
      } else {
        const objectIdx = localAbi.objectTypes.findIndex(
          (type) => type.type === importedType
        );

        const enumIdx =
          objectIdx === -1 &&
          localAbi.enumTypes.findIndex(
            (type) => type.type === importedType
          );

        if (objectIdx > -1) {
          visitorFunc = visitObjectDefinition;
          type = localAbi.objectTypes[objectIdx];
        } else if (enumIdx > -1) {
          visitorFunc = visitEnumDefinition;
          type = localAbi.enumTypes.find(
            (type) => type.type === importedType
          );
        }
      }

      if (!type) {
        throw Error(
          `Cannot find type "${importedType}" in the schema at ${path}.\nFound: [ ${localAbi.objectTypes.map(
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
            `resolveLocalImports: Cannot find the requested type within the Abi.\n` +
              `Type: ${def.type}\nAbi: ${JSON.stringify(localAbi)}`
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
                ...localAbi.objectTypes,
                ...localAbi.importedObjectTypes,
              ]);
            },
            EnumRef: (def: EnumRef) => {
              return findImport(def, [
                ...localAbi.enumTypes,
                ...localAbi.importedEnumTypes,
              ]);
            },
            InterfaceImplementedDefinition: (
              def: InterfaceImplementedDefinition
            ) => {
              return findImport(def, [
                ...localAbi.objectTypes,
                ...localAbi.importedObjectTypes,
              ]);
            },
          },
        });
      };

      visitedTypes[type.type] = true;
      visitType(type);
    }

    // Add all imported types into the aggregate Abi
    for (const importType of Object.keys(typesToImport)) {
      if (isEnvType(importType)) {
        if (isClientEnvType(importType)) {
          if (!abi.envType.client) {
            abi.envType.client = createObjectDefinition({
              type: envTypes.ClientEnv,
            });
          }

          const sharedEnv = localAbi.envType.client as ObjectDefinition;

          checkDuplicateEnvProperties(
            abi.envType.client,
            sharedEnv.properties
          );

          abi.envType.client.properties.push(...sharedEnv.properties);
        } else {
          if (!abi.envType.sanitized) {
            abi.envType.sanitized = createObjectDefinition({
              type: envTypes.Env,
            });
          }

          const sharedEnv = localAbi.envType.sanitized as ObjectDefinition;

          checkDuplicateEnvProperties(
            abi.envType.sanitized,
            sharedEnv.properties
          );

          abi.envType.sanitized.properties.push(...sharedEnv.properties);
        }
      } else if (
        isKind(typesToImport[importType], DefinitionKind.ImportedObject)
      ) {
        if (
          abi.importedObjectTypes.findIndex(
            (def) => def.type === importType
          ) === -1
        ) {
          abi.importedObjectTypes.push(
            typesToImport[importType] as ImportedObjectDefinition
          );
        }
      } else if (isKind(typesToImport[importType], DefinitionKind.Object)) {
        if (
          abi.objectTypes.findIndex((def) => def.type === importType) ===
          -1
        ) {
          abi.objectTypes.push(
            typesToImport[importType] as ObjectDefinition
          );
        }
      } else if (
        isKind(typesToImport[importType], DefinitionKind.ImportedEnum)
      ) {
        if (
          abi.importedEnumTypes.findIndex(
            (def) => def.type === importType
          ) === -1
        ) {
          abi.importedEnumTypes.push(
            typesToImport[importType] as ImportedEnumDefinition
          );
        }
      } else if (isKind(typesToImport[importType], DefinitionKind.Enum)) {
        if (
          abi.enumTypes.findIndex((def) => def.type === importType) === -1
        ) {
          abi.enumTypes.push(typesToImport[importType] as EnumDefinition);
        }
      }
    }
  }
}
