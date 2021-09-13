import { MethodDefinition } from "../../typeInfo";
import { comparePropertyType, comparePropertyTypes } from "./property-type";
import { CompareOptions, CompareResult, VersionRelease } from "./utils";

export function compareMethodType(
  obj1: MethodDefinition,
  obj2: MethodDefinition,
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

    const returnResult = comparePropertyType(obj1.return, obj2.return, options);
    if (returnResult.hasShortCircuit) return returnResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      returnResult.versionRelease
    );

    const argumentsResult = comparePropertyTypes(
      obj1.arguments,
      obj2.arguments,
      options
    );
    if (argumentsResult.hasShortCircuit) return argumentsResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      argumentsResult.versionRelease
    );

    return result;
  }
  result.versionRelease = VersionRelease.MAJOR;
  result.hasShortCircuit = true;
  return result;
}

export function compareMethodTypes(
  arr1: MethodDefinition[],
  arr2: MethodDefinition[],
  options?: CompareOptions
): CompareResult {
  const result: CompareResult = {
    versionRelease: VersionRelease.PATCH,
    hasShortCircuit: false,
  };
  const indexMap2: Map<string, number> = new Map<string, number>();
  for (let i = 0; i < arr2.length; i++) {
    indexMap2.set(arr2[i].name as string, i);
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1: MethodDefinition = arr1[i];
    if (indexMap2.get(obj1.name as string) == undefined) {
      result.versionRelease = VersionRelease.MAJOR;
      result.hasShortCircuit = true;
      return result;
    }
    const obj2: MethodDefinition =
      arr2[indexMap2.get(obj1.name as string) as number];

    const methodResult = compareMethodType(obj1, obj2, options);
    if (methodResult.hasShortCircuit) return methodResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      methodResult.versionRelease
    );
  }

  return result;
}
