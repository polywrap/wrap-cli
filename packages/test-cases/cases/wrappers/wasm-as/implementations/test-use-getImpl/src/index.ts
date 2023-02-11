import {
  Args_moduleMethod,
  Args_moduleImplementations,
  Args_abstractModuleMethod,
  ImplementationType,
  Interface,
  ModuleBase,
} from "./wrap";

export class Module extends ModuleBase {
  moduleImplementations(_: Args_moduleImplementations): string[] {
    return Interface.getImplementations();
  }
  
  moduleMethod(args: Args_moduleMethod): ImplementationType {
    return args.arg;
  }
  
  abstractModuleMethod(args: Args_abstractModuleMethod): String {
    return args.arg.str;
  }
}
