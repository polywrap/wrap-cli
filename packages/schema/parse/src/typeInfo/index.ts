import {
  ObjectDefinition,
  ModuleDefinition,
  ImportedModuleDefinition,
  ImportedObjectDefinition,
  GenericDefinition,
  EnumDefinition,
  ImportedEnumDefinition,
  InterfaceDefinition,
  CapabilityType,
  CapabilityDefinition,
  EnvDefinition,
  createEnvDefinition,
} from "./definitions";

export * from "./definitions";
export * from "./scalar";
export * from "./operation";
export * from "./module";
export * from "./env";

export interface TypeInfo {
  objectTypes: ObjectDefinition[];
  moduleTypes: ModuleDefinition[];
  enumTypes: EnumDefinition[];
  interfaceTypes: InterfaceDefinition[];
  importedObjectTypes: ImportedObjectDefinition[];
  importedModuleTypes: ImportedModuleDefinition[];
  importedEnumTypes: ImportedEnumDefinition[];
  envTypes: {
    query: EnvDefinition;
    mutation: EnvDefinition;
  };
}

export function createTypeInfo(): TypeInfo {
  return {
    objectTypes: [],
    enumTypes: [],
    moduleTypes: [],
    interfaceTypes: [],
    importedObjectTypes: [],
    importedModuleTypes: [],
    importedEnumTypes: [],
    envTypes: {
      query: createEnvDefinition({}),
      mutation: createEnvDefinition({}),
    },
  };
}

type ImportedDefinition = ImportedObjectDefinition | ImportedModuleDefinition;

export function combineTypeInfo(typeInfos: TypeInfo[]): TypeInfo {
  const combined: TypeInfo = {
    objectTypes: [],
    moduleTypes: [],
    enumTypes: [],
    interfaceTypes: [],
    importedObjectTypes: [],
    importedModuleTypes: [],
    importedEnumTypes: [],
    envTypes: {
      query: createEnvDefinition({}),
      mutation: createEnvDefinition({}),
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

    for (const ModuleType of typeInfo.moduleTypes) {
      tryInsert(combined.moduleTypes, ModuleType);
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

    for (const importedModuleType of typeInfo.importedModuleTypes) {
      tryInsert(
        combined.importedModuleTypes,
        importedModuleType,
        compareImportedType,
        (a: ImportedModuleDefinition, b: ImportedModuleDefinition) => {
          return { ...a, isInterface: a.isInterface || b.isInterface };
        }
      );
    }

    for (const importedEnumType of typeInfo.importedEnumTypes) {
      tryInsert(combined.importedEnumTypes, importedEnumType);
    }

    if (typeInfo.envTypes.query.client) {
      combined.envTypes.query.client = typeInfo.envTypes.query.client;
    }

    if (typeInfo.envTypes.query.sanitized) {
      combined.envTypes.query.sanitized = typeInfo.envTypes.query.sanitized;
    }

    if (typeInfo.envTypes.mutation.client) {
      combined.envTypes.mutation.client = typeInfo.envTypes.mutation.client;
    }

    if (typeInfo.envTypes.mutation.sanitized) {
      combined.envTypes.mutation.sanitized =
        typeInfo.envTypes.mutation.sanitized;
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
