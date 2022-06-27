import { Args_moduleMethod, Args_abstractModuleMethod, ImplementationType, Interface } from "./wrap";

export function moduleImplementations(): string[] {
  return Interface.getImplementations();
}

export function moduleMethod(args: Args_moduleMethod): ImplementationType {
  return args.arg;
}

export function abstractModuleMethod(args: Args_abstractModuleMethod): String {
  return args.arg.str;
}
