import {
  Args_method,
  LargeCollection,
  ModuleBase
} from "./wrap";

export class Module extends ModuleBase {
  method(args: Args_method): LargeCollection {
    return args.largeCollection;
  }
}
