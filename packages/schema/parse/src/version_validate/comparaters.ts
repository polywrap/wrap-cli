import { EnumDefinition, GenericDefinition } from "../typeInfo";
import { stringifyEnumTypes, stringifyGenericSet } from "./serializers";
import { compareSets, SetComparisionType } from "./setUtils";

export function compareGenericTypes(
  t1: GenericDefinition[],
  t2: GenericDefinition[]
): SetComparisionType {
  let generic_s1: Set<string> = stringifyGenericSet(t1);
  let generic_s2: Set<string> = stringifyGenericSet(t2);
  return compareSets(generic_s1, generic_s2);
}

export function compareEnumTypes(
  t1: EnumDefinition[],
  t2: EnumDefinition[]
): SetComparisionType {
  let s1: Set<string> = stringifyEnumTypes(t1);
  let s2: Set<string> = stringifyEnumTypes(t2);
  return compareSets(s1, s2);
}
