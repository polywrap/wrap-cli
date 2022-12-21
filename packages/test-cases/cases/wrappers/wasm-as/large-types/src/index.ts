import {
  Args_method,
  LargeCollection,
  IModule
} from "./wrap";

export class Module extends IModule {
  method(args: Args_method): LargeCollection {
    return args.largeCollection;
  }
}
