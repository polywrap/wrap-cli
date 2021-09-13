export enum SetComparisonResult {
  EQUAL,
  SUBSET,
  DIFFERENT,
}

export function compareSets<T>(
  set1: Set<T>,
  set2: Set<T>
): SetComparisonResult {
  if (set1.size > set2.size) {
    //No need to check anything else in this case, so we will return early
    return SetComparisonResult.DIFFERENT;
  }

  for (const item of set1) {
    if (!set2.has(item)) {
      return SetComparisonResult.DIFFERENT;
    }
  }

  if (set1.size === set2.size) {
    return SetComparisonResult.EQUAL;
  } else {
    return SetComparisonResult.SUBSET;
  }
}
