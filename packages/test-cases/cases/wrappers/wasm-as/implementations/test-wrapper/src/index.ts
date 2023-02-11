import { Args_moduleMethod, Args_abstractModuleMethod, ImplementationType, ModuleBase } from "./wrap";

export class Module extends ModuleBase {
  moduleMethod(args: Args_moduleMethod): ImplementationType {
    return args.arg;
  }
  
  abstractModuleMethod(args: Args_abstractModuleMethod): string {
    return args.arg.str;
  }
}
