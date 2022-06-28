import {
  Args_method1,
  Result,
} from "./wrap";

export function method1(args: Args_method1): Result {
  return {
    "const": "result: " + args.const.const,
  };
}
