import { Args_iThrow, ModuleBase } from "./wrap";

export class Module extends ModuleBase {
  iThrow(args: Args_iThrow): i32 {
    if (2 == 2) {
      throw new Error("I threw an error!");
    }
    return args.a + 1;
  }
}
