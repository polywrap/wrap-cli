import { Args_method, IModule } from "./wrap";

export class Module extends IModule {
  method(args: Args_method): string {
    return args.arg;
  }
}
