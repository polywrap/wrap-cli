import { QueryDefinition } from "../../typeInfo";
import { compareGenericTypes } from "./generic-type";
import { compareImportTypes } from "./import-type";
import { compareMethodTypes } from "./method-type";
import { CompareOptions, CompareResult, VersionRelease } from "./utils";

export function compareQueryType(
  obj1: QueryDefinition,
  obj2: QueryDefinition,
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

    const importResult = compareImportTypes(
      obj1.imports,
      obj2.imports,
      options
    );
    if (importResult.hasShortCircuit) return importResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      importResult.versionRelease
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

export function compareQueryTypes(
  arr1: QueryDefinition[],
  arr2: QueryDefinition[],
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
    const obj1: QueryDefinition = arr1[i];
    if (indexMap2.get(obj1.type) == undefined) {
      result.versionRelease = VersionRelease.MAJOR;
      result.hasShortCircuit = true;
      return result;
    }
    const obj2: QueryDefinition = arr2[indexMap2.get(obj1.type) as number];

    const queryResult = compareQueryType(obj1, obj2, options);
    if (queryResult.hasShortCircuit) return queryResult;
    result.versionRelease = Math.max(
      result.versionRelease,
      queryResult.versionRelease
    );
  }
  return result;
}
