import {
  Args_greeting,
  Foo_Module,
  IModule,
} from "./wrap";

export class Module extends IModule {
  greeting(args: Args_greeting): string {
    return Foo_Module.foo({ bar: args.message }).unwrap();
  }
}
