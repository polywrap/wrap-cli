import { Args_subInvokeWillThrow, BadUtil_Module } from "./wrap";

export function subInvokeWillThrow(args: Args_subInvokeWillThrow): i32 {
  const subInvokeResult = BadUtil_Module.iThrow({ a: 0 }).unwrap();
  return args.a + args.b + subInvokeResult;
}
