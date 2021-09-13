import { ImportedEnumDefinition } from "../../typeInfo";
import { compareEnumType } from "./EnumType";
import { compareImportedType } from "./ImportedType";
import { CompareOptions, CompareResult, VersionRelease } from "./utils";

export function compareImportedEnumTypes(
  arr1: ImportedEnumDefinition[],
  arr2: ImportedEnumDefinition[],
  options?: CompareOptions
): CompareResult {
  const result: CompareResult = {
    versionRelease: VersionRelease.PATCH,
    hasShortCircuit: false,
  };
  const indexMap2: Map<string, number> = new Map<string, number>();
  for (let i = 0; i < arr2.length; i++) {
    indexMap2.set(arr2[i].type, i);
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1: ImportedEnumDefinition = arr1[i];
    if (indexMap2.get(obj1.type) == undefined) {
      result.versionRelease = VersionRelease.MAJOR;
      result.hasShortCircuit = true;
      return result;
    }
    const obj2: ImportedEnumDefinition =
      arr2[indexMap2.get(obj1.type) as number];

    const enumResult = compareEnumType(obj1, obj2, options);
    if (enumResult.hasShortCircuit) return enumResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      enumResult.versionRelease
    );

    const importedResult = compareImportedType(obj1, obj2, options);
    if (importedResult.hasShortCircuit) return importedResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      importedResult.versionRelease
    );
  }
  return result;
}
