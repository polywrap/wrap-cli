const countDuplicates = (array: string[]) =>
  array.reduce(
    (a: any, b: string) => ({ ...a, [b]: (a[b] || 0) + 1 }),
    {}
  );

export const getDuplicates = (array: string[]) => {
  const counts = countDuplicates(array);
  return Object.keys(counts).filter((a) => counts[a] > 1);
};