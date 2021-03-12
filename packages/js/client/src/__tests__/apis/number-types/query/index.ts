import {
  Input_i32Method,
  Input_u32Method,
  // Input_f32Method
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

// export function f32Method(input: Input_f32Method): f32 {
//   const firstFloat = input.first;
//   const secondFloat = input.second;
//   return firstFloat + secondFloat;
// }
