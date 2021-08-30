export enum SetComparisionType {
  EQUAL,
  SUBSET,
  DIFFERENT,
}

export function union<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  return new Set([...set1, ...set2]);
}

export function intersection<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  return new Set([...set1].filter((x) => set2.has(x)));
}

export function difference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  return new Set([...set1].filter((x) => !set2.has(x)));
}

export function symmentric_difference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  return difference(union(set1, set2), intersection(set1, set2));
}

export function compareSets<T>(set1: Set<T>, set2: Set<T>): SetComparisionType {
  let sd: Set<T> = symmentric_difference(set1, set2);
  if (sd.size === 0) {
    return SetComparisionType.EQUAL;
  } else if (difference(set1, set2).size === 0) {
    return SetComparisionType.SUBSET;
  } else {
    return SetComparisionType.DIFFERENT;
  }
}
