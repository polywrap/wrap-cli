import { Input_moduleMethod, Input_abstractModuleMethod, ImplementationType, Interface } from "./w3";

export function queryImplementations(): string[] {
  return Interface.getImplementations();
}

export function moduleMethod(input: Input_moduleMethod): ImplementationType {
  return input.arg;
}

export function abstractModuleMethod(input: Input_abstractModuleMethod): String {
  return input.arg.str;
}
