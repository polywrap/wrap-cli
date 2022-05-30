export const isObject = (val: unknown): boolean => {
  if (val === null) {
    return false;
  }
  return typeof val === "function" || typeof val === "object";
};
