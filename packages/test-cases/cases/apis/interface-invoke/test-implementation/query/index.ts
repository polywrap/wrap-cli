import { Input_queryMethod, Input_abstractQueryMethod, ImplementationType } from "./w3";

export function queryMethod(input: Input_queryMethod): ImplementationType {
  return input.arg;
}

export function abstractQueryMethod(input: Input_abstractQueryMethod): String {
  return input.arg.str;
}
