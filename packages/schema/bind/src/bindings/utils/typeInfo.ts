import { getRelativePath } from "./path";
import { BindModuleOptions } from "../../";

import {
  createTypeInfo,
  TypeInfo,
  DefinitionKind,
  EnumDefinition,
  GenericDefinition,
  ImportedEnumDefinition,
  ImportedModuleDefinition,
  ImportedObjectDefinition,
  ObjectDefinition,
} from "@web3api/schema-parse";

export function extractCommonTypeInfo(modules: BindModuleOptions[], commonDirAbs: string): TypeInfo {
  const counts: Record<string, number> = {};
  const firstDefinition: Record<string, GenericDefinition> = {};
  const commonTypeInfo: TypeInfo = createTypeInfo();

  const trackCommonTypes = (commonPath: string) =>
    (def: GenericDefinition) => {
      if (!counts[def.type]) {
        counts[def.type] = 0;
      }
      counts[def.type] += 1;

      if (counts[def.type] === 1) {
        firstDefinition[def.type] = def;
      } else {
        // Mark both the first definition & current definition as "common"
        const commonProps = {
          __commonPath: commonPath
        };

        // If this is the first duplicate being tracked
        if (firstDefinition[def.type]) {
          // Add common props to first & second instances
          Object.assign(firstDefinition[def.type], commonProps);
          Object.assign(def, commonProps);

          // Add the definition to the common TypeInfo
          switch (def.kind) {
            case DefinitionKind.Enum:
              commonTypeInfo.enumTypes.push(
                def as EnumDefinition
              );
              break;
            case DefinitionKind.Object:
              commonTypeInfo.objectTypes.push(
                def as ObjectDefinition
              );
              break;
            case DefinitionKind.ImportedEnum:
              commonTypeInfo.importedEnumTypes.push(
                def as ImportedEnumDefinition
              );
              break;
            case DefinitionKind.ImportedObject:
              commonTypeInfo.importedObjectTypes.push(
                def as ImportedObjectDefinition
              );
              break;
            case DefinitionKind.ImportedModule:
              commonTypeInfo.importedModuleTypes.push(
                def as ImportedModuleDefinition
              );
              break;
            default:
              throw Error(
                `extractCommonTypes: Unable to track common type ${def.type}`
              );
          }

          // Remove the "first instance" so it is no longer modified
          delete firstDefinition[def.type];
        }
      }
    };

  for (const module of modules) {
    const typeInfo = module.typeInfo;
    const commonPath = getRelativePath(module.outputDirAbs, commonDirAbs);

    typeInfo.enumTypes.forEach(trackCommonTypes(commonPath));
    typeInfo.objectTypes.forEach(trackCommonTypes(commonPath));
    typeInfo.importedEnumTypes.forEach(trackCommonTypes(commonPath));
    typeInfo.importedObjectTypes.forEach(trackCommonTypes(commonPath));
    typeInfo.importedModuleTypes.forEach(trackCommonTypes(commonPath));
  }

  return commonTypeInfo;
}
