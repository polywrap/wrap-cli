import { SetComparisionType } from "./setUtils";
export function compare(obj1: unknown, obj2: unknown): SetComparisionType {
  let result: SetComparisionType;
  let arr1: Array<unknown> = obj1 as Array<unknown>;
  let arr2: Array<unknown> = obj2 as Array<unknown>;
  if (arr1.length > arr2.length) return SetComparisionType.DIFFERENT;

  let arrayElements1: Array<unknown> = arr1.filter((x) => typeof x != "string");
  let arrayElements2: Array<unknown> = arr2.filter((x) => typeof x != "string");
  let stringElements1: Array<string> = arr1.filter(
    (x) => typeof x == "string"
  ) as Array<string>;
  let stringElements2: Array<string> = arr2.filter(
    (x) => typeof x == "string"
  ) as Array<string>;

  let set2: Set<string> = new Set(stringElements2);
  if (!stringElements1.every((x) => set2.has(x))) {
    return SetComparisionType.DIFFERENT;
  } else if (stringElements1.length == stringElements2.length) {
    result = SetComparisionType.EQUAL;
  } else {
    result = SetComparisionType.SUBSET;
  }

  let results: Array<SetComparisionType> = new Array<SetComparisionType>(
    arrayElements1.length
  );
  for (let i = 0; i < arrayElements1.length; i++) {
    results[i] = SetComparisionType.DIFFERENT;
    for (let j = 0; j < arrayElements2.length; j++) {
      let newResult: SetComparisionType = compare(arrayElements1[i], arrayElements2[j]);
      results[i] = Math.min(newResult, results[i]);
    }
    if (results[i] == SetComparisionType.DIFFERENT) {
      return SetComparisionType.DIFFERENT;
    }
  }
  if (results.find((x) => x === SetComparisionType.SUBSET)) {
    return SetComparisionType.SUBSET;
  } else if (result === SetComparisionType.SUBSET){
    return SetComparisionType.SUBSET;
  } else if (arrayElements1.length < arrayElements2.length) {
    return SetComparisionType.SUBSET;
  }
  return SetComparisionType.EQUAL;
}
