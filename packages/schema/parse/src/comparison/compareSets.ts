export enum SetComparisonType {
  EQUAL,
  SUBSET,
  DIFFERENT,
}

export function compareSets<T>(set1: Set<T>, set2: Set<T>): SetComparisonType {
  if (set1.size > set2.size) {
    //No need to check anything else in this case, so we will return early
    return SetComparisonType.DIFFERENT;
  }

  for (const item of set1) {
    if (!set2.has(item)) {
      return SetComparisonType.DIFFERENT;
    }
  }

  if (set1.size === set2.size) {
    return SetComparisonType.EQUAL;
  } else {
    return SetComparisonType.SUBSET;
  }
}
