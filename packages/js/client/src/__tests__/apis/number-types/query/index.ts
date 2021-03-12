import {
  Input_i32Method,
  Input_u32Method
} from "./w3";

export function i32Method(input: Input_i32Method): i32 {
  const firstInt = input.first;
  const secondInt = input.second;
  return firstInt + secondInt;
}

export function u32Method(input: Input_u32Method): u32 {
  const firstInt = input.first;
  const secondInt = input.second;
  return firstInt + secondInt;
}
