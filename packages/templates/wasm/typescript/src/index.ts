import { Args_foo, ModuleBase } from "./wrap";

export class Module extends ModuleBase {
  foo(args: Args_foo): string {
    throw new Error("Not implemented");
  }
}
