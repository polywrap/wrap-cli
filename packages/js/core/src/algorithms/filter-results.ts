import { Tracer } from "@web3api/tracing";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function filterResults(
  result: unknown,
  filter: Record<string, any>
): unknown {
  Tracer.startSpan("core: filterResults");

  Tracer.setAttribute("result", result);
  Tracer.setAttribute("filter", filter);

  try {
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
      if (res[key]) {
        if (typeof filter[key] === "boolean") {
          filtered[key] = res[key];
        } else {
          filtered[key] = filterResults(res[key], filter[key]);
        }
      } else {
        filtered[key] = undefined;
      }
    }

    Tracer.addEvent("filtering finished", filtered);

    return filtered;
  } catch (error) {
    Tracer.recordException(error);

    throw error;
  } finally {
    Tracer.endSpan();
  }
}
