import { SetComparisonResult, compareSets } from "../compareSets";
import {
  ImportDefinition,
  CompareOptions,
  CompareResult,
  VersionRelease,
} from "./utils";

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
  const setResult: SetComparisonResult = compareSets(s1, s2);

  switch (setResult) {
    case SetComparisonResult.EQUAL:
      result.versionRelease = VersionRelease.PATCH;
      break;
    case SetComparisonResult.SUBSET:
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
