/* eslint-disable @typescript-eslint/naming-convention */
import {
  GenericDefinition,
  TypeInfo,
  TypeInfoTransforms,
} from "@web3api/schema-parse";

export function findCommonTypes(a: TypeInfo, b: TypeInfo): string[] {
  const types: Record<string, boolean> = {};

  const addType = (def: GenericDefinition) => {
    types[def.type] = true;
  };

  a.objectTypes.forEach(addType);
  a.enumTypes.forEach(addType);
  a.importedEnumTypes.forEach(addType);
  a.importedObjectTypes.forEach(addType);
  a.importedModuleTypes.forEach(addType);

  const commonTypes: string[] = [];

  const tryAddCommonType = (def: GenericDefinition) => {
    if (types[def.type]) {
      commonTypes.push(def.type);
    }
  };

  b.objectTypes.forEach(tryAddCommonType);
  b.enumTypes.forEach(tryAddCommonType);
  b.importedEnumTypes.forEach(tryAddCommonType);
  b.importedObjectTypes.forEach(tryAddCommonType);
  b.importedModuleTypes.forEach(tryAddCommonType);

  return commonTypes;
}

export function extendCommonTypes(
  commonTypes: string[],
  commonPath?: string
): TypeInfoTransforms {
  const commonExtension = (type: string) =>
    commonTypes.includes(type)
      ? {
          __common: true,
          __commonPath: commonPath || null,
          __commonImport: !!commonPath,
        }
      : {
          __common: null,
          __commonPath: commonPath || null,
          __commonImport: false,
        };

  return {
    enter: {
      GenericDefinition: (def: GenericDefinition) => ({
        ...def,
        ...commonExtension(def.type),
      }),
    },
  };
}
