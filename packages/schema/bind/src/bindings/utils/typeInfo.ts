/* eslint-disable @typescript-eslint/naming-convention */
import { BindModuleOptions } from "../../";

import {
  createTypeInfo,
  TypeInfo,
  DefinitionKind,
  EnumDefinition,
  GenericDefinition,
  ImportedEnumDefinition,
  ImportedObjectDefinition,
  ObjectDefinition,
} from "@web3api/schema-parse";
import { getRelativePath } from "@web3api/os-js";

export function extractCommonTypeInfo(
  modules: BindModuleOptions[],
  commonDirAbs: string
): TypeInfo {
  const counts: Record<string, number> = {};
  const firstDefinition: Record<string, GenericDefinition> = {};
  const commonTypeInfo: TypeInfo = createTypeInfo();

  const trackCommonTypes = (commonProps: Record<string, unknown>) => (
    def: GenericDefinition
  ) => {
    if (!counts[def.type]) {
      counts[def.type] = 0;
    }
    counts[def.type] += 1;

    if (counts[def.type] === 1) {
      firstDefinition[def.type] = def;
    } else {
      // If this is the first duplicate being tracked
      // Mark both the first definition & current definition as "common"
      if (firstDefinition[def.type]) {
        const defCopy = Object.assign({}, def);

        // Ensure the common properties are unset
        for (const key of Object.keys(commonProps)) {
          ((defCopy as unknown) as Record<string, unknown>)[key] = undefined;
        }

        // Add the definition to the common TypeInfo
        switch (def.kind) {
          case DefinitionKind.Enum:
            commonTypeInfo.enumTypes.push(
              defCopy as EnumDefinition
            );
            break;
          case DefinitionKind.Object:
            commonTypeInfo.objectTypes.push(
              defCopy as ObjectDefinition
            );
            break;
          case DefinitionKind.ImportedEnum:
            commonTypeInfo.importedEnumTypes.push(
              defCopy as ImportedEnumDefinition
            );
            break;
          case DefinitionKind.ImportedObject:
            commonTypeInfo.importedObjectTypes.push(
              defCopy as ImportedObjectDefinition
            );
            break;
          default:
            throw Error(
              `extractCommonTypes: Unable to track common type ${def.type}`
            );
        }

        // Add common props to first & second instances
        Object.assign(firstDefinition[def.type], commonProps);
        Object.assign(def, commonProps);

        // Remove the "first instance" so it is no longer modified
        delete firstDefinition[def.type];
      }
    }
  };

  const getCommonProps = (module: BindModuleOptions) => {
    const commonPath = getRelativePath(module.outputDirAbs, commonDirAbs);
    return {
      __commonPath: commonPath,
    };
  };

  for (const module of modules) {
    const typeInfo = module.typeInfo;
    const commonProps = getCommonProps(module);

    typeInfo.enumTypes.forEach(trackCommonTypes(commonProps));
    typeInfo.objectTypes.forEach(trackCommonTypes(commonProps));
    typeInfo.importedEnumTypes.forEach(trackCommonTypes(commonProps));
    typeInfo.importedObjectTypes.forEach(trackCommonTypes(commonProps));
  }

  if (Object.values(counts).filter((x) => x > 1).length) {
    for (const module of modules) {
      const commonProps = getCommonProps(module);
      Object.assign(module.typeInfo, commonProps);
    }
  }

  return {
    ...commonTypeInfo,
    __commonModule: true,
  } as TypeInfo;
}
