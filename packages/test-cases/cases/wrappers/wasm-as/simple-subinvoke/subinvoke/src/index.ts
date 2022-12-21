import { Args_add, IModule } from "./wrap";

export class Module extends IModule {
  add(args: Args_add): i32 {
    return args.a + args.b;
  }
}
