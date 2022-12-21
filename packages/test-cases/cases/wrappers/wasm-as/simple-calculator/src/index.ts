import { Args_add, Args_sub, IModule } from "./wrap";

export class Module extends IModule {
  add(args: Args_add): i32 {
    return args.a + args.b;
  }

  sub(args: Args_sub): i32 {
    return args.a - args.b;
  }
}
