import { TypeInfo } from "..";
import { compare, VersionRelease } from "./comparers";

export { compare };

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
