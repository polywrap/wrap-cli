import { TypeInfo } from "..";
import { compare, VersionRelease } from "./comparers";

export { compare };

export function areTypeInfosFunctionallyIdentical(
  typeInfoA: TypeInfo,
  typeInfoB: TypeInfo
): boolean {
  return compare(typeInfoA, typeInfoB) === VersionRelease.PATCH;
}

export function areTypeInfosBackwardCompatible(
  baseTypeInfo: TypeInfo,
  derivedTypeInfo: TypeInfo
): boolean {
  return compare(baseTypeInfo, derivedTypeInfo) === VersionRelease.MINOR;
}
