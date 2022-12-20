import { IModule, Args_simpleMethod } from "./wrap";

export class Module extends IModule {
  simpleMethod(args: Args_simpleMethod): string {
    return args.arg;
  }
}
