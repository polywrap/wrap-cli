import { Input_mutationMethod, Input_abstractMutationMethod } from "./w3";

export function mutationMethod(input: Input_mutationMethod): u8 {
  return input.arg;
}

export function abstractMutationMethod(input: Input_abstractMutationMethod): u8 {
  return input.arg;
}
