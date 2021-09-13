import { PropertyDefinition } from "../../typeInfo";
import { compareArrayType } from "./ArrayType";
import { compareGenericType } from "./GenericType";
import { CompareOptions, CompareResult, VersionRelease } from "./utils";

export function comparePropertyType(
  obj1: PropertyDefinition,
  obj2: PropertyDefinition,
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
    if (obj1.scalar && obj2.scalar) {
      const scalarResult = compareGenericType(
        obj1.scalar,
        obj2.scalar,
        options
      );
      if (scalarResult.hasShortCircuit) return scalarResult;
      result.versionRelease = Math.max(
        result.versionRelease,
        scalarResult.versionRelease
      );
    }
    if (obj1.enum && obj2.enum) {
      const enumResult = compareGenericType(obj1.enum, obj2.enum, options);
      if (enumResult.hasShortCircuit) return enumResult;
      result.versionRelease = Math.max(
        result.versionRelease,
        enumResult.versionRelease
      );
    }
    if (obj1.object && obj2.object) {
      const objectResult = compareGenericType(
        obj1.object,
        obj2.object,
        options
      );
      if (objectResult.hasShortCircuit) return objectResult;
      result.versionRelease = Math.max(
        result.versionRelease,
        objectResult.versionRelease
      );
    }
    if (obj1.array && obj2.array) {
      const arrayResult = compareArrayType(obj1.array, obj2.array, options);
      if (arrayResult.hasShortCircuit) return arrayResult;
      result.versionRelease = Math.max(
        result.versionRelease,
        arrayResult.versionRelease
      );
    }
    if (obj1.unresolvedObjectOrEnum && obj2.unresolvedObjectOrEnum) {
      const unresolvedResult = compareGenericType(
        obj1.unresolvedObjectOrEnum,
        obj2.unresolvedObjectOrEnum,
        options
      );
      if (unresolvedResult.hasShortCircuit) return unresolvedResult;
      result.versionRelease = Math.max(
        result.versionRelease,
        unresolvedResult.versionRelease
      );
    }
    return result;
  }
  result.versionRelease = VersionRelease.MAJOR;
  result.hasShortCircuit = true;
  return result;
}

export function comparePropertyTypes(
  arr1: PropertyDefinition[],
  arr2: PropertyDefinition[],
  options?: CompareOptions
): CompareResult {
  const result: CompareResult = {
    versionRelease: VersionRelease.PATCH,
    hasShortCircuit: false,
  };
  const indexMap2: Map<string, number> = new Map<string, number>();
  const isCorrelated: Array<boolean> = new Array<boolean>(arr2.length);
  for (let i = 0; i < arr2.length; i++) {
    indexMap2.set(arr2[i].name as string, i);
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1: PropertyDefinition = arr1[i];
    if (indexMap2.get(obj1.name as string) == undefined) {
      result.versionRelease = VersionRelease.MAJOR;
      result.hasShortCircuit = true;
      return result;
    }
    isCorrelated[indexMap2.get(obj1.name as string) as number] = true;
    const obj2: PropertyDefinition =
      arr2[indexMap2.get(obj1.name as string) as number];

    const propertyResult = comparePropertyType(obj1, obj2, options);
    if (propertyResult.hasShortCircuit) return propertyResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      propertyResult.versionRelease
    );
  }

  for (let i = 0; i < isCorrelated.length; i++) {
    if (!isCorrelated[i]) {
      const obj2: PropertyDefinition = arr2[i];
      if (obj2.required) {
        result.versionRelease = VersionRelease.MAJOR;
        result.hasShortCircuit = true;
        return result;
      } else {
        result.versionRelease = VersionRelease.MINOR;
      }
    }
  }

  if (options?.shortCircuit && result.versionRelease > options.shortCircuit) {
    result.hasShortCircuit = true;
  }

  return result;
}
