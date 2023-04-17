import { Args_method, ModuleBase } from "./wrap";

export class Module extends ModuleBase {
  method(args: Args_method): string {
    return args.arg;
  }
}
