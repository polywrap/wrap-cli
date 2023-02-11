import { Args_add, ModuleBase } from "./wrap";

export class Module extends ModuleBase {
  add(args: Args_add): i32 {
    return args.a + args.b;
  }
}
