import { Args_simpleMethod, SimpleResult } from "./wrap";

export function simpleMethod(args: Args_simpleMethod): SimpleResult {
  return {
    value: args.arg,
  };
}
