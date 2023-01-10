import { Args_iThrow } from "./wrap";

export function iThrow(args: Args_iThrow): i32 {
  if (2 == 2) {
    throw new Error("I threw an error!");
  }
  return args.a + 1;
}
