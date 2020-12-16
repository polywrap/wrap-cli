export function filterResults(result: unknown, filter: Record<string, any>): unknown {

  if (typeof result !== 'object') {
    throw Error("The result given is not an object. Filters can only be given on results that are of 'object' type.");
  }

  if (!result) {
    return result;
  }

  const filtered: Record<string, any> = { };
  const res: any = result;

  for (const key of Object.keys(filter)) {
    if (res[key]) {
      if (typeof filter[key] === "boolean") {
        filtered[key] = res[key];
      } else {
        filtered[key] = filterResults(res[key], filter[key]);
      }
    }
  }

  return filtered;
}
