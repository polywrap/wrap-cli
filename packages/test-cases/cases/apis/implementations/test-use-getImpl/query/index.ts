import { Input_queryMethod, Input_abstractQueryMethod, ImplementationType, Interface } from "./w3";

export function queryImplementations(): string[] {
  return Interface.getImplementations();
}

export function queryMethod(input: Input_queryMethod): ImplementationType {
  return input.arg;
}

export function abstractQueryMethod(input: Input_abstractQueryMethod): String {
  return input.arg.str;
}
