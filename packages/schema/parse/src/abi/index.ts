import { CapabilityType, createModuleDefinition } from "./definitions";

import {
  WrapAbi,
  CapabilityDefinition,
  GenericDefinition,
  ImportedModuleDefinition,
  ImportedObjectDefinition,
  InterfaceDefinition,
} from "@polywrap/wrap-manifest-types-js";

export * from "./definitions";
export * from "./env";

export function createAbi(): WrapAbi {
  return {
    objectTypes: [],
    enumTypes: [],
    interfaceTypes: [],
    importedObjectTypes: [],
    importedModuleTypes: [],
    importedEnumTypes: [],
    importedEnvTypes: [],
  };
}

type ImportedDefinition = ImportedObjectDefinition | ImportedModuleDefinition;

export function combineAbi(abis: WrapAbi[]): WrapAbi {
  const combined: WrapAbi = {
    objectTypes: [],
    moduleType: createModuleDefinition({}),
    enumTypes: [],
    interfaceTypes: [],
    importedObjectTypes: [],
    importedModuleTypes: [],
    importedEnumTypes: [],
    importedEnvTypes: [],
  };

  const compareImportedType = (
    a: ImportedDefinition,
    b: ImportedDefinition
  ) => {
    return a.uri === b.uri && a.nativeType === b.nativeType;
  };

  for (const abi of abis) {
    for (const enumType of abi.enumTypes) {
      tryInsert(combined.enumTypes, enumType);
    }

    for (const objectType of abi.objectTypes) {
      tryInsert(combined.objectTypes, objectType);
    }

    combined.moduleType = abi.moduleType;

    for (const interfaceType of abi.interfaceTypes) {
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
              combinedCapabilities[capability] = {
                enabled: true,
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

    if (abi.envType) {
      combined.envType = abi.envType;
    }

    for (const importedObjectType of abi.importedObjectTypes) {
      tryInsert(
        combined.importedObjectTypes,
        importedObjectType,
        compareImportedType
      );
    }

    for (const importedModuleType of abi.importedModuleTypes) {
      tryInsert(
        combined.importedModuleTypes,
        importedModuleType,
        compareImportedType,
        (a: ImportedModuleDefinition, b: ImportedModuleDefinition) => {
          return { ...a, isInterface: a.isInterface || b.isInterface };
        }
      );
    }

    for (const importedEnumType of abi.importedEnumTypes) {
      tryInsert(combined.importedEnumTypes, importedEnumType);
    }

    for (const importedEnvType of abi.importedEnvTypes) {
      tryInsert(
        combined.importedEnvTypes,
        importedEnvType,
        compareImportedType
      );
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
        `combineAbi found two types by the same type that are not equivalent.\n` +
          `Type: "${value.type}"\nObject A: ${destType}\nObject B: ${valueType}`
      );
    }
  } else {
    dest.push(value);
  }
};
