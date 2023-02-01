/* eslint-disable @typescript-eslint/no-explicit-any */

export const deepCopy = <T>(value: T): T => {
  if (typeof value !== "object" || value === null) return value;
  let newO, i;

  if (value instanceof Array) {
    let length;
    newO = [];
    for (i = 0, length = value.length; i < length; i++)
      newO[i] = deepCopy(value[i]);
    return newO as any;
  }
  newO = {} as any;
  for (i in value)
    if ((value as any).hasOwnProperty.call(i))
      newO[i] = deepCopy((value as any)[i]);
  return newO as any;
};
