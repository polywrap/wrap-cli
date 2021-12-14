import {
  ObjectDefinition,
  QueryDefinition,
  ImportedQueryDefinition,
  ImportedObjectDefinition,
  GenericDefinition,
  EnumDefinition,
  ImportedEnumDefinition,
  InterfaceDefinition,
  CapabilityType,
  CapabilityDefinition,
} from "./definitions";

export * from "./definitions";
export * from "./scalar";
export * from "./operation";
export * from "./query";

export enum EnvironmentType {
  QueryClientEnvType = "QueryClientEnv",
  QueryEnvType = "QueryEnv",
  MutationClientEnvType = "MutationClientEnv",
  MutationEnvType = "MutationEnv",
}

export interface Environment {
  sanitized?: ObjectDefinition;
  client?: ObjectDefinition;
}

export interface TypeInfo {
  objectTypes: ObjectDefinition[];
  queryTypes: QueryDefinition[];
  enumTypes: EnumDefinition[];
  interfaceTypes: InterfaceDefinition[];
  importedObjectTypes: ImportedObjectDefinition[];
  importedQueryTypes: ImportedQueryDefinition[];
  importedEnumTypes: ImportedEnumDefinition[];
  environment: {
    mutation: Environment;
    query: Environment;
  };
}

export function createTypeInfo(): TypeInfo {
  return {
    objectTypes: [],
    enumTypes: [],
    queryTypes: [],
    interfaceTypes: [],
    importedObjectTypes: [],
    importedQueryTypes: [],
    importedEnumTypes: [],
    environment: {
      mutation: {},
      query: {},
    },
  };
}

type ImportedDefinition = ImportedObjectDefinition | ImportedQueryDefinition;

export function combineTypeInfo(typeInfos: TypeInfo[]): TypeInfo {
  const combined: TypeInfo = {
    objectTypes: [],
    queryTypes: [],
    enumTypes: [],
    interfaceTypes: [],
    importedObjectTypes: [],
    importedQueryTypes: [],
    importedEnumTypes: [],
    environment: {
      mutation: {},
      query: {},
    },
  };

  const compareImportedType = (
    a: ImportedDefinition,
    b: ImportedDefinition
  ) => {
    return a.uri === b.uri && a.nativeType === b.nativeType;
  };

  for (const typeInfo of typeInfos) {
    for (const enumType of typeInfo.enumTypes) {
      tryInsert(combined.enumTypes, enumType);
    }

    for (const objectType of typeInfo.objectTypes) {
      tryInsert(combined.objectTypes, objectType);
    }

    for (const queryType of typeInfo.queryTypes) {
      tryInsert(combined.queryTypes, queryType);
    }

    for (const interfaceType of typeInfo.interfaceTypes) {
      tryInsert(
        combined.interfaceTypes,
        interfaceType,
        compareImportedType,
        (
          a: InterfaceDefinition,
          b: InterfaceDefinition
        ): InterfaceDefinition => {
          const combinedCapabilities: CapabilityDefinition = {
            ...a.capabilities,
            ...b.capabilities,
          };
          const combinedCapabilityTypes = Object.keys(
            combinedCapabilities
          ) as CapabilityType[];
          for (const capability of combinedCapabilityTypes) {
            if (b.capabilities[capability] && a.capabilities[capability]) {
              const combinedModules = Array.from(
                new Set([
                  ...a.capabilities[capability].modules,
                  ...b.capabilities[capability].modules,
                ])
              );
              combinedCapabilities[capability] = {
                enabled: true,
                modules: combinedModules,
              };
            } else if (a.capabilities[capability]) {
              combinedCapabilities[capability] = a.capabilities[capability];
            } else if (b.capabilities[capability]) {
              combinedCapabilities[capability] = b.capabilities[capability];
            }
          }
          return { ...a, capabilities: combinedCapabilities };
        }
      );
    }

    for (const importedObjectType of typeInfo.importedObjectTypes) {
      tryInsert(
        combined.importedObjectTypes,
        importedObjectType,
        compareImportedType
      );
    }

    for (const importedQueryType of typeInfo.importedQueryTypes) {
      tryInsert(
        combined.importedQueryTypes,
        importedQueryType,
        compareImportedType,
        (a: ImportedQueryDefinition, b: ImportedQueryDefinition) => {
          return { ...a, isInterface: a.isInterface || b.isInterface };
        }
      );
    }

    for (const importedEnumType of typeInfo.importedEnumTypes) {
      tryInsert(combined.importedEnumTypes, importedEnumType);
    }
  }

  return combined;
}

const tryInsert = (
  dest: GenericDefinition[],
  value: GenericDefinition,
  compare: (a: GenericDefinition, b: GenericDefinition) => boolean = (a, b) =>
    a.type === b.type,
  join?: (
    dest: GenericDefinition,
    source: GenericDefinition
  ) => GenericDefinition
) => {
  const index = dest.findIndex((item: GenericDefinition) =>
    compare(item, value)
  );

  if (index > -1) {
    if (join) {
      dest[index] = join(dest[index], value);
      return;
    }

    const destType = JSON.stringify(dest[index]);
    const valueType = JSON.stringify(value);
    if (destType !== valueType) {
      throw Error(
        `combineTypeInfo found two types by the same type that are not equivalent.\n` +
          `Type: "${value.type}"\nObject A: ${destType}\nObject B: ${valueType}`
      );
    }
  } else {
    dest.push(value);
  }
};
