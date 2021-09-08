import {
  QueryDefinition,
  EnumDefinition,
  ObjectDefinition,
  PropertyDefinition,
  GenericDefinition,
  ArrayDefinition,
  MethodDefinition,
  ImportedQueryDefinition,
  ImportedEnumDefinition,
  ImportedObjectDefinition,
  ImportedDefinition,
} from "../typeInfo/definitions";
import { TypeInfo } from "../typeInfo";
import { compareSets, SetComparisonType } from "./compareSets";

export type ImportDefinition = { type: string };

export enum VersionRelease {
  PATCH,
  MINOR,
  MAJOR,
}

export interface CompareOptions {
  shortCircuit?: VersionRelease;
}

export interface CompareResult {
  versionRelease: VersionRelease;
  hasShortCircuit: boolean;
}

export function compare(
  t1: TypeInfo,
  t2: TypeInfo,
  options?: CompareOptions
): CompareResult {
  const result: CompareResult = {
    versionRelease: VersionRelease.PATCH,
    hasShortCircuit: false,
  };

  const enumResult = compareEnumTypes(t1.enumTypes, t2.enumTypes, options);
  if (enumResult.hasShortCircuit) return enumResult;
  result.versionRelease = Math.max(
    result.versionRelease,
    enumResult.versionRelease
  );

  const objectResult = compareObjectTypes(
    t1.objectTypes,
    t2.objectTypes,
    options
  );
  if (objectResult.hasShortCircuit) return objectResult;
  result.versionRelease = Math.max(
    result.versionRelease,
    objectResult.versionRelease
  );

  const queryResult = compareQueryTypes(t1.queryTypes, t2.queryTypes, options);
  if (queryResult.hasShortCircuit) return queryResult;
  result.versionRelease = Math.max(
    result.versionRelease,
    queryResult.versionRelease
  );

  const importedEnumResult = compareImportedEnumTypes(
    t1.importedEnumTypes,
    t2.importedEnumTypes,
    options
  );
  if (importedEnumResult.hasShortCircuit) return importedEnumResult;
  result.versionRelease = Math.max(
    result.versionRelease,
    importedEnumResult.versionRelease
  );

  const importedObjectResult = compareImportedObjectTypes(
    t1.importedObjectTypes,
    t2.importedObjectTypes,
    options
  );
  if (importedObjectResult.hasShortCircuit) return importedObjectResult;
  result.versionRelease = Math.max(
    result.versionRelease,
    importedObjectResult.versionRelease
  );

  const importedQueryResult = compareImportedQueryTypes(
    t1.importedQueryTypes,
    t2.importedQueryTypes,
    options
  );
  if (importedQueryResult.hasShortCircuit) return importedQueryResult;
  result.versionRelease = Math.max(
    result.versionRelease,
    importedQueryResult.versionRelease
  );

  return result;
}

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
    const setResult: SetComparisonType = compareSets(c1, c2);

    switch (setResult) {
      case SetComparisonType.EQUAL:
        result.versionRelease = VersionRelease.PATCH;
        break;
      case SetComparisonType.SUBSET:
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

export function compareImportedType(
  obj1: ImportedDefinition,
  obj2: ImportedDefinition,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: CompareOptions
): CompareResult {
  const result: CompareResult = {
    versionRelease: VersionRelease.PATCH,
    hasShortCircuit: false,
  };
  if (
    obj1.namespace === obj2.namespace &&
    obj1.uri === obj2.uri &&
    obj1.nativeType === obj2.nativeType
  ) {
    return result;
  }
  result.versionRelease = VersionRelease.MAJOR;
  result.hasShortCircuit = true;
  return result;
}

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

export function compareImportTypes(
  arr1: ImportDefinition[],
  arr2: ImportDefinition[],
  options?: CompareOptions
): CompareResult {
  const result: CompareResult = {
    versionRelease: VersionRelease.PATCH,
    hasShortCircuit: false,
  };
  const s1 = new Set(arr1.map((x) => x.type));
  const s2 = new Set(arr2.map((x) => x.type));
  const setResult: SetComparisonType = compareSets(s1, s2);

  switch (setResult) {
    case SetComparisonType.EQUAL:
      result.versionRelease = VersionRelease.PATCH;
      break;
    case SetComparisonType.SUBSET:
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
    if (indexMap2.get(obj1.type as string) == undefined) {
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
    if (indexMap2.get(obj1.type) == undefined) {
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
