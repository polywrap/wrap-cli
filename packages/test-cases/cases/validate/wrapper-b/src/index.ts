import {
  Args_greeting,
  Foo_Module,
  ModuleBase,
} from "./wrap";

export class Module extends ModuleBase {
  greeting(args: Args_greeting): string {
    return Foo_Module.foo({ bar: args.message }).unwrap();
  }
}
