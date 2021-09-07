export enum SetComparisionType {
  EQUAL,
  SUBSET,
  DIFFERENT,
}

export function compareSets<T>(set1: Set<T>, set2: Set<T>): SetComparisionType {
  if (set1.size > set2.size) {
    //No need to check anything else in this case, so we will return early
    return SetComparisionType.DIFFERENT;
  }

  for (const item of set1) {
    if (!set2.has(item)) {
      return SetComparisionType.DIFFERENT;
    }
  }

  if (set1.size === set2.size) {
    return SetComparisionType.EQUAL;
  } else {
    return SetComparisionType.SUBSET;
  }
}
