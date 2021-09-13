import { TypeInfo } from "../typeInfo";
import { compareEnumTypes } from "./comparers/enum-type";
import { compareImportedEnumTypes } from "./comparers/imported-enum-type";
import { compareImportedObjectTypes } from "./comparers/imported-object-type";
import { compareImportedQueryTypes } from "./comparers/imported-query-type";
import { compareObjectTypes } from "./comparers/object-type";
import { compareQueryTypes } from "./comparers/query-type";
import {
  CompareOptions,
  CompareResult,
  VersionRelease,
} from "./comparers/utils";

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

export function areTypeInfosFunctionallyIdentical(
  typeInfoA: TypeInfo,
  typeInfoB: TypeInfo
): boolean {
  const result = compare(typeInfoA, typeInfoB, {
    shortCircuit: VersionRelease.PATCH,
  });
  return (
    !result.hasShortCircuit && result.versionRelease === VersionRelease.PATCH
  );
}

export function areTypeInfosBackwardCompatible(
  baseTypeInfo: TypeInfo,
  derivedTypeInfo: TypeInfo
): boolean {
  const result = compare(baseTypeInfo, derivedTypeInfo, {
    shortCircuit: VersionRelease.MINOR,
  });
  return (
    !result.hasShortCircuit && result.versionRelease === VersionRelease.MINOR
  );
}
