import { IModule, Args_subInvokeWillThrow, BadUtil_Module } from "./wrap";

export class Module extends IModule {
  subInvokeWillThrow(args: Args_subInvokeWillThrow): i32 {
    const subInvokeResult = BadUtil_Module.iThrow({ a: 0 }).unwrap();
    return args.a + args.b + subInvokeResult;
  }
}
