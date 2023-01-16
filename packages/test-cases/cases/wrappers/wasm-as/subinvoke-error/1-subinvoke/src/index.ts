import { Args_iThrow, IModule } from "./wrap";

export class Module extends IModule {
  iThrow(args: Args_iThrow): i32 {
    if (2 == 2) {
      throw new Error("I threw an error!");
    }
    return args.a + 1;
  }
}
