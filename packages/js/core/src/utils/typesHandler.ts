export const typesHandler = (_: unknown, value: unknown): unknown => {
  if (value instanceof Map) {
    return Array.from(value).reduce(
      (obj: Record<string, unknown>, [key, value]) => {
        obj[key] = value;
        return obj;
      },
      {}
    );
  }

  return value;
};
