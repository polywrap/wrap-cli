import { EnumDefinition } from "../../typeInfo";
import { SetComparisonResult, compareSets } from "../compareSets";
import { CompareOptions, CompareResult, VersionRelease } from "./utils";

export function compareEnumType(
  obj1: EnumDefinition,
  obj2: EnumDefinition,
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

    const c1: Set<string> = new Set<string>(obj1.constants);
    const c2: Set<string> = new Set<string>(obj2.constants);
    const setResult: SetComparisonResult = compareSets(c1, c2);

    switch (setResult) {
      case SetComparisonResult.EQUAL:
        result.versionRelease = VersionRelease.PATCH;
        break;
      case SetComparisonResult.SUBSET:
        result.versionRelease = VersionRelease.MINOR;
        break;
      default:
        result.versionRelease = VersionRelease.MAJOR;
        result.hasShortCircuit = true;
        return result;
    }
    if (options?.shortCircuit && result.versionRelease > options.shortCircuit) {
      result.hasShortCircuit = true;
    }
    return result;
  }
  result.versionRelease = VersionRelease.MAJOR;
  result.hasShortCircuit = true;
  return result;
}

export function compareEnumTypes(
  arr1: EnumDefinition[],
  arr2: EnumDefinition[],
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
    const obj1: EnumDefinition = arr1[i];
    if (indexMap2.get(obj1.type) == undefined) {
      result.versionRelease = VersionRelease.MAJOR;
      result.hasShortCircuit = true;
      return result;
    }
    const obj2: EnumDefinition = arr2[indexMap2.get(obj1.type) as number];

    const enumResult = compareEnumType(obj1, obj2, options);
    if (enumResult.hasShortCircuit) return enumResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      enumResult.versionRelease
    );
  }
  return result;
}
