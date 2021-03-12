import {
  Input_integerMethod
} from "./w3";

export function integerMethod(input: Input_integerMethod): i32 {
  const firstInt = input.first;
  const secondInt = input.second;
  return firstInt + secondInt;
}
