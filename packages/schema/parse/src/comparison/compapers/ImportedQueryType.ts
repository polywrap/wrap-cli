import { ImportedQueryDefinition } from "../../typeInfo";
import { compareGenericType } from "./GenericType";
import { compareImportedType } from "./ImportedType";
import { compareMethodTypes } from "./MethodType";
import { CompareOptions, CompareResult, VersionRelease } from "./utils";

export function compareImportedQueryTypes(
  arr1: ImportedQueryDefinition[],
  arr2: ImportedQueryDefinition[],
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
    const obj1: ImportedQueryDefinition = arr1[i];

    if (indexMap2.get(arr1[i].type) == undefined) {
      result.versionRelease = VersionRelease.MAJOR;
      result.hasShortCircuit = true;
      return result;
    }
    const obj2: ImportedQueryDefinition =
      arr2[indexMap2.get(obj1.type) as number];

    const genericResult = compareGenericType(obj1, obj2, options);
    if (genericResult.hasShortCircuit) return genericResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      genericResult.versionRelease
    );

    const methodResult = compareMethodTypes(
      obj1.methods,
      obj2.methods,
      options
    );
    if (methodResult.hasShortCircuit) return methodResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      methodResult.versionRelease
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
