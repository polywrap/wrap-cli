export function setFirstLast(arr: {
  first: boolean | null,
  last: boolean | null
}[]) {
  if (arr.length > 0) {
    arr[0].first = true;
    arr[arr.length - 1].last = true;
  }
}
