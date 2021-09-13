import { ArrayDefinition } from "../../typeInfo";
import { compareGenericType } from "./generic-type";
import { CompareOptions, CompareResult, VersionRelease } from "./utils";

export function compareArrayType(
  obj1: ArrayDefinition,
  obj2: ArrayDefinition,
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
    if (obj1.item && obj2.item) {
      const itemResult = compareGenericType(obj1.item, obj2.item, options);
      if (itemResult.hasShortCircuit) return itemResult;
      result.versionRelease = Math.max(
        result.versionRelease,
        itemResult.versionRelease
      );
    }
    return result;
  }
  result.versionRelease = VersionRelease.MAJOR;
  result.hasShortCircuit = true;
  return result;
}
