import { ImportedDefinition } from "../../typeInfo";
import { CompareOptions, CompareResult, VersionRelease } from "./utils";

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
