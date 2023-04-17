/**
 * Converts a Map object with string keys into an object with key-value pairs
 * that can be stringified using JSON.stringify. Returns an empty object if the
 * keys are not of type string. Returns the original value if it is not a Map.
 *
 * @param _ Unused.
 * @param value The value from the object to be stringified.
 * @returns The converted object or the original value if it is not a Map
 * or if the Map's keys are not of type string.
 */
export const typesHandler = (_: unknown, value: unknown): unknown => {
  if (value instanceof Map) {
    const obj: Record<string, unknown> = {};
    const firstKey = value.keys().next().value;
    if (typeof firstKey === "string") {
      for (const [k, v] of value.entries()) {
        obj[k] = v;
      }
    }
    return obj;
  }

  return value;
};
