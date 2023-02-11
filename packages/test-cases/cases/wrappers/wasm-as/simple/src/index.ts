import { ModuleBase, Args_simpleMethod } from "./wrap";

export class Module extends ModuleBase {
  simpleMethod(args: Args_simpleMethod): string {
    return args.arg;
  }
}
