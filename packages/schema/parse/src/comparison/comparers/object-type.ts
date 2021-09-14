import { ObjectDefinition } from "../../typeInfo";
import { compareGenericTypes } from "./generic-type";
import { comparePropertyTypes } from "./property-type";
import { CompareOptions, CompareResult, VersionRelease } from "./utils";

export function compareObjectType(
  obj1: ObjectDefinition,
  obj2: ObjectDefinition,
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

    const propertyResult = comparePropertyTypes(
      obj1.properties,
      obj2.properties,
      options
    );
    if (propertyResult.hasShortCircuit) return propertyResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      propertyResult.versionRelease
    );

    const interfaceResult = compareGenericTypes(
      obj1.interfaces,
      obj2.interfaces,
      options
    );
    if (interfaceResult.hasShortCircuit) return interfaceResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      interfaceResult.versionRelease
    );

    return result;
  }
  result.versionRelease = VersionRelease.MAJOR;
  result.hasShortCircuit = true;
  return result;
}

export function compareObjectTypes(
  arr1: ObjectDefinition[],
  arr2: ObjectDefinition[],
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
    const obj1: ObjectDefinition = arr1[i];
    if (indexMap2.get(obj1.type) === undefined) {
      result.versionRelease = VersionRelease.MAJOR;
      result.hasShortCircuit = true;
      return result;
    }
    const obj2: ObjectDefinition = arr2[indexMap2.get(obj1.type) as number];

    const objectResult = compareObjectType(obj1, obj2, options);
    if (objectResult.hasShortCircuit) return objectResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      objectResult.versionRelease
    );
  }
  return result;
}
