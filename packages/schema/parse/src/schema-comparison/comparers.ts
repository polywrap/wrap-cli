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
import { compareSets, SetComparisionType } from "./setUtils";

export type ImportDefinition = { type: string };

export enum VersionRelease {
  PATCH,
  MINOR,
  MAJOR,
}

export function compare(t1: TypeInfo, t2: TypeInfo): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  result = Math.max(result, compareEnumTypes(t1.enumTypes, t2.enumTypes));
  result = Math.max(result, compareObjectTypes(t1.objectTypes, t2.objectTypes));
  result = Math.max(result, compareQueryTypes(t1.queryTypes, t2.queryTypes));
  result = Math.max(
    result,
    compareImportedEnumTypes(t1.importedEnumTypes, t2.importedEnumTypes)
  );
  result = Math.max(
    result,
    compareImportedObjectTypes(t1.importedObjectTypes, t2.importedObjectTypes)
  );
  result = Math.max(
    result,
    compareImportedQueryTypes(t1.importedQueryTypes, t2.importedQueryTypes)
  );
  return result;
}

export function compareGenericType(
  obj1: GenericDefinition,
  obj2: GenericDefinition
): VersionRelease {
  if (
    obj1.kind === obj2.kind &&
    obj1.name === obj2.name &&
    obj1.type === obj2.type
  ) {
    if (!obj1.required && obj2.required) {
      return VersionRelease.MAJOR;
    }
    return VersionRelease.PATCH;
  }
  return VersionRelease.MAJOR;
}

export function compareEnumType(
  obj1: EnumDefinition,
  obj2: EnumDefinition
): VersionRelease {
  if (
    obj1.kind === obj2.kind &&
    obj1.name === obj2.name &&
    obj1.type === obj2.type
  ) {
    if (!obj1.required && obj2.required) {
      return VersionRelease.MAJOR;
    }

    const c1: Set<string> = new Set<string>(obj1.constants);
    const c2: Set<string> = new Set<string>(obj2.constants);
    const result: SetComparisionType = compareSets(c1, c2);

    switch (result) {
      case SetComparisionType.EQUAL:
        return VersionRelease.PATCH;
      case SetComparisionType.SUBSET:
        return VersionRelease.MINOR;
      default:
        return VersionRelease.MAJOR;
    }
  }
  return VersionRelease.MAJOR;
}

export function compareQueryType(
  obj1: QueryDefinition,
  obj2: QueryDefinition
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  if (
    obj1.kind === obj2.kind &&
    obj1.name === obj2.name &&
    obj1.type === obj2.type
  ) {
    if (!obj1.required && obj2.required) {
      return VersionRelease.MAJOR;
    }
    result = Math.max(result, compareMethodTypes(obj1.methods, obj2.methods));
    result = Math.max(result, compareImportTypes(obj1.imports, obj2.imports));
    result = Math.max(
      result,
      compareGenericTypes(obj1.interfaces, obj2.interfaces)
    );
    return result;
  }
  return VersionRelease.MAJOR;
}

export function compareObjectType(
  obj1: ObjectDefinition,
  obj2: ObjectDefinition
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  if (
    obj1.kind === obj2.kind &&
    obj1.name === obj2.name &&
    obj1.type === obj2.type
  ) {
    if (!obj1.required && obj2.required) {
      return VersionRelease.MAJOR;
    }
    result = Math.max(
      result,
      comparePropertyTypes(obj1.properties, obj2.properties)
    );
    result = Math.max(
      result,
      compareGenericTypes(obj1.interfaces, obj2.interfaces)
    );
    return result;
  }
  return VersionRelease.MAJOR;
}

export function compareImportedType(
  obj1: ImportedDefinition,
  obj2: ImportedDefinition
): VersionRelease {
  if (
    obj1.namespace === obj2.namespace &&
    obj1.uri === obj2.uri &&
    obj1.nativeType === obj2.nativeType
  ) {
    return VersionRelease.PATCH;
  }
  return VersionRelease.MAJOR;
}

export function compareArrayType(
  obj1: ArrayDefinition,
  obj2: ArrayDefinition
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  if (
    obj1.kind === obj2.kind &&
    obj1.name === obj2.name &&
    obj1.type === obj2.type
  ) {
    if (!obj1.required && obj2.required) {
      return VersionRelease.MAJOR;
    }
    if (obj1.scalar && obj2.scalar) {
      result = Math.max(result, compareGenericType(obj1.scalar, obj2.scalar));
    }
    if (obj1.enum && obj2.enum) {
      result = Math.max(result, compareGenericType(obj1.enum, obj2.enum));
    }
    if (obj1.object && obj2.object) {
      result = Math.max(result, compareGenericType(obj1.object, obj2.object));
    }
    if (obj1.array && obj2.array) {
      result = Math.max(result, compareArrayType(obj1.array, obj2.array));
    }
    if (obj1.unresolvedObjectOrEnum && obj2.unresolvedObjectOrEnum) {
      result = Math.max(
        result,
        compareGenericType(
          obj1.unresolvedObjectOrEnum,
          obj2.unresolvedObjectOrEnum
        )
      );
    }
    if (obj1.item && obj2.item) {
      result = Math.max(result, compareGenericType(obj1.item, obj2.item));
    }
    return result;
  }
  return VersionRelease.MAJOR;
}

export function comparePropertyType(
  obj1: PropertyDefinition,
  obj2: PropertyDefinition
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  if (
    obj1.kind === obj2.kind &&
    obj1.name === obj2.name &&
    obj1.type === obj2.type
  ) {
    if (!obj1.required && obj2.required) {
      return VersionRelease.MAJOR;
    }
    if (obj1.scalar && obj2.scalar) {
      result = Math.max(result, compareGenericType(obj1.scalar, obj2.scalar));
    }
    if (obj1.enum && obj2.enum) {
      result = Math.max(result, compareGenericType(obj1.enum, obj2.enum));
    }
    if (obj1.object && obj2.object) {
      result = Math.max(result, compareGenericType(obj1.object, obj2.object));
    }
    if (obj1.array && obj2.array) {
      result = Math.max(result, compareArrayType(obj1.array, obj2.array));
    }
    if (obj1.unresolvedObjectOrEnum && obj2.unresolvedObjectOrEnum) {
      result = Math.max(
        result,
        compareGenericType(
          obj1.unresolvedObjectOrEnum,
          obj2.unresolvedObjectOrEnum
        )
      );
    }
    return result;
  }
  return VersionRelease.MAJOR;
}

export function compareMethodType(
  obj1: MethodDefinition,
  obj2: MethodDefinition
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  if (
    obj1.kind === obj2.kind &&
    obj1.name === obj2.name &&
    obj1.type === obj2.type
  ) {
    if (!obj1.required && obj2.required) {
      return VersionRelease.MAJOR;
    }
    result = Math.max(result, comparePropertyType(obj1.return, obj2.return));
    result = Math.max(
      result,
      comparePropertyTypes(obj1.arguments, obj2.arguments)
    );
    return result;
  }
  return VersionRelease.MAJOR;
}

export function compareImportTypes(
  arr1: ImportDefinition[],
  arr2: ImportDefinition[]
): VersionRelease {
  const s1 = new Set(arr1.map((x) => x.type));
  const s2 = new Set(arr2.map((x) => x.type));
  const result: SetComparisionType = compareSets(s1, s2);

  switch (result) {
    case SetComparisionType.EQUAL:
      return VersionRelease.PATCH;
    case SetComparisionType.SUBSET:
      return VersionRelease.MINOR;
    default:
      return VersionRelease.MAJOR;
  }
}

export function compareMethodTypes(
  arr1: MethodDefinition[],
  arr2: MethodDefinition[]
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  const indexMap2: Map<string, number> = new Map<string, number>();
  for (let i = 0; i < arr2.length; i++) {
    indexMap2.set(arr2[i].name as string, i);
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1: MethodDefinition = arr1[i];
    if (indexMap2.get(obj1.name as string) == undefined) {
      return VersionRelease.MAJOR;
    }
    const obj2: MethodDefinition =
      arr2[indexMap2.get(obj1.name as string) as number];
    result = Math.max(result, compareMethodType(obj1, obj2));
  }

  return result;
}

export function compareQueryTypes(
  arr1: QueryDefinition[],
  arr2: QueryDefinition[]
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  const indexMap2: Map<string, number> = new Map<string, number>();
  for (let i = 0; i < arr2.length; i++) {
    indexMap2.set(arr2[i].type, i);
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1: QueryDefinition = arr1[i];
    if (indexMap2.get(obj1.type) == undefined) {
      return VersionRelease.MAJOR;
    }
    const obj2: QueryDefinition = arr2[indexMap2.get(obj1.type) as number];
    result = Math.max(result, compareQueryType(obj1, obj2));
  }
  return result;
}

export function comparePropertyTypes(
  arr1: PropertyDefinition[],
  arr2: PropertyDefinition[]
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  const indexMap2: Map<string, number> = new Map<string, number>();
  const isCorrelated: Array<boolean> = new Array<boolean>(arr2.length);
  for (let i = 0; i < arr2.length; i++) {
    indexMap2.set(arr2[i].name as string, i);
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1: PropertyDefinition = arr1[i];
    if (indexMap2.get(obj1.name as string) == undefined) {
      return VersionRelease.MAJOR;
    }
    isCorrelated[indexMap2.get(obj1.name as string) as number] = true;
    const obj2: PropertyDefinition =
      arr2[indexMap2.get(obj1.name as string) as number];
    result = Math.max(result, comparePropertyType(obj1, obj2));
  }

  for (let i = 0; i < isCorrelated.length; i++) {
    if (!isCorrelated[i]) {
      const obj2: PropertyDefinition = arr2[i];
      if (obj2.required) {
        return VersionRelease.MAJOR;
      } else {
        result = VersionRelease.MINOR;
      }
    }
  }

  return result;
}

export function compareGenericTypes(
  arr1: GenericDefinition[],
  arr2: GenericDefinition[]
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  const indexMap2: Map<string, number> = new Map<string, number>();
  for (let i = 0; i < arr2.length; i++) {
    indexMap2.set(arr2[i].type as string, i);
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1: GenericDefinition = arr1[i];
    if (indexMap2.get(obj1.type as string) == undefined) {
      return VersionRelease.MAJOR;
    }
    const obj2: GenericDefinition = arr2[indexMap2.get(obj1.type) as number];
    result = Math.max(result, compareGenericType(obj1, obj2));
  }
  return result;
}

export function compareObjectTypes(
  arr1: ObjectDefinition[],
  arr2: ObjectDefinition[]
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  const indexMap2: Map<string, number> = new Map<string, number>();
  for (let i = 0; i < arr2.length; i++) {
    indexMap2.set(arr2[i].type, i);
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1: ObjectDefinition = arr1[i];
    if (indexMap2.get(obj1.type) == undefined) {
      return VersionRelease.MAJOR;
    }
    const obj2: ObjectDefinition = arr2[indexMap2.get(obj1.type) as number];
    result = Math.max(result, compareObjectType(obj1, obj2));
  }
  return result;
}

export function compareEnumTypes(
  arr1: EnumDefinition[],
  arr2: EnumDefinition[]
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  const indexMap2: Map<string, number> = new Map<string, number>();
  for (let i = 0; i < arr2.length; i++) {
    indexMap2.set(arr2[i].type, i);
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1: EnumDefinition = arr1[i];
    if (indexMap2.get(obj1.type) == undefined) {
      return VersionRelease.MAJOR;
    }
    const obj2: EnumDefinition = arr2[indexMap2.get(obj1.type) as number];
    result = Math.max(result, compareEnumType(obj1, obj2));
  }
  return result;
}

export function compareImportedQueryTypes(
  arr1: ImportedQueryDefinition[],
  arr2: ImportedQueryDefinition[]
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  const indexMap2: Map<string, number> = new Map<string, number>();
  for (let i = 0; i < arr2.length; i++) {
    indexMap2.set(arr2[i].type, i);
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1: ImportedQueryDefinition = arr1[i];

    if (indexMap2.get(arr1[i].type) == undefined) {
      return VersionRelease.MAJOR;
    }
    const obj2: ImportedQueryDefinition =
      arr2[indexMap2.get(obj1.type) as number];
    result = Math.max(result, compareGenericType(obj1, obj2));
    result = Math.max(result, compareMethodTypes(obj1.methods, obj2.methods));
    result = Math.max(result, compareImportedType(obj1, obj2));
  }
  return result;
}

export function compareImportedEnumTypes(
  arr1: ImportedEnumDefinition[],
  arr2: ImportedEnumDefinition[]
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  const indexMap2: Map<string, number> = new Map<string, number>();
  for (let i = 0; i < arr2.length; i++) {
    indexMap2.set(arr2[i].type, i);
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1: ImportedEnumDefinition = arr1[i];
    if (indexMap2.get(obj1.type) == undefined) {
      return VersionRelease.MAJOR;
    }
    const obj2: ImportedEnumDefinition =
      arr2[indexMap2.get(obj1.type) as number];
    result = Math.max(result, compareEnumType(obj1, obj2));
    result = Math.max(result, compareImportedType(obj1, obj2));
  }
  return result;
}

export function compareImportedObjectTypes(
  arr1: ImportedObjectDefinition[],
  arr2: ImportedObjectDefinition[]
): VersionRelease {
  let result: VersionRelease = VersionRelease.PATCH;
  const indexMap2: Map<string, number> = new Map<string, number>();
  for (let i = 0; i < arr2.length; i++) {
    indexMap2.set(arr2[i].type, i);
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1: ImportedObjectDefinition = arr1[i];
    if (indexMap2.get(obj1.type) == undefined) {
      return VersionRelease.MAJOR;
    }
    const obj2: ImportedObjectDefinition =
      arr2[indexMap2.get(obj1.type) as number];
    result = Math.max(result, compareObjectType(obj1, obj2));
    result = Math.max(result, compareImportedType(obj1, obj2));
  }
  return result;
}
