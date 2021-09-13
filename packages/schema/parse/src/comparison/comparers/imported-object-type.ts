import { ImportedObjectDefinition } from "../../typeInfo";
import { compareImportedType } from "./imported-type";
import { compareObjectType } from "./object-type";
import { CompareOptions, CompareResult, VersionRelease } from "./utils";

export function compareImportedObjectTypes(
  arr1: ImportedObjectDefinition[],
  arr2: ImportedObjectDefinition[],
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
    const obj1: ImportedObjectDefinition = arr1[i];
    if (indexMap2.get(obj1.type) == undefined) {
      result.versionRelease = VersionRelease.MAJOR;
      result.hasShortCircuit = true;
      return result;
    }
    const obj2: ImportedObjectDefinition =
      arr2[indexMap2.get(obj1.type) as number];

    const objectResult = compareObjectType(obj1, obj2, options);
    if (objectResult.hasShortCircuit) return objectResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      objectResult.versionRelease
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
