import { Tracer } from "@polywrap/tracing-js";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const filterResults = Tracer.traceFunc(
  "core: filterResults",
  (result: unknown, filter: Record<string, any>): unknown => {
    if (!result) {
      return result;
    }

    if (typeof result !== "object") {
      throw Error(
        `The result given is not an object. ` +
          `Filters can only be given on results that are of 'object' type.\n` +
          `Filter: ${JSON.stringify(filter, null, 2)}`
      );
    }

    const filtered: Record<string, any> = {};
    const res: any = result;

    for (const key of Object.keys(filter)) {
      if (res[key] !== undefined) {
        if (typeof filter[key] === "boolean") {
          filtered[key] = res[key];
        } else {
          filtered[key] = filterResults(res[key], filter[key]);
        }
      } else {
        filtered[key] = undefined;
      }
    }

    return filtered;
  }
);
