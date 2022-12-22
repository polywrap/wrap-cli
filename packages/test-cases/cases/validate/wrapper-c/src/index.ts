import {
  Args_foo,
  IModule,
} from "./wrap";

export class Module extends IModule {
  foo(args: Args_foo): string {
    return args.bar.toString()
  }
}
