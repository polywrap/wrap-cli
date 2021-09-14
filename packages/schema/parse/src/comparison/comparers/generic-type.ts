import { GenericDefinition } from "../../typeInfo";
import { CompareOptions, CompareResult, VersionRelease } from "./utils";

export function compareGenericType(
  obj1: GenericDefinition,
  obj2: GenericDefinition,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: CompareOptions
): CompareResult {
  const result: CompareResult = {
    versionRelease: VersionRelease.PATCH,
    hasShortCircuit: false,
  };
  if (
    obj1.kind === obj2.kind &&
    obj1.name === obj2.name &&
    obj1.type === obj2.type
  ) {
    if (!obj1.required && obj2.required) {
      result.versionRelease = VersionRelease.MAJOR;
      result.hasShortCircuit = true;
      return result;
    }
    return result;
  }
  result.versionRelease = VersionRelease.MAJOR;
  result.hasShortCircuit = true;
  return result;
}

export function compareGenericTypes(
  arr1: GenericDefinition[],
  arr2: GenericDefinition[],
  options?: CompareOptions
): CompareResult {
  const result: CompareResult = {
    versionRelease: VersionRelease.PATCH,
    hasShortCircuit: false,
  };
  const indexMap2: Map<string, number> = new Map<string, number>();
  for (let i = 0; i < arr2.length; i++) {
    indexMap2.set(arr2[i].type as string, i);
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1: GenericDefinition = arr1[i];
    if (indexMap2.get(obj1.type as string) === undefined) {
      result.versionRelease = VersionRelease.MAJOR;
      result.hasShortCircuit = true;
      return result;
    }
    const obj2: GenericDefinition = arr2[indexMap2.get(obj1.type) as number];

    const genericResult = compareGenericType(obj1, obj2, options);
    if (genericResult.hasShortCircuit) return genericResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      genericResult.versionRelease
    );
  }
  return result;
}
