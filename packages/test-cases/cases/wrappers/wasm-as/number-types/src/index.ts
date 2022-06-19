import {
  Input_i8Method,
  Input_u8Method,
  Input_i16Method,
  Input_u16Method,
  Input_i32Method,
  Input_u32Method,
} from "./wrap";

export function i8Method(input: Input_i8Method): i8 {
  const firstInt = input.first;
  const secondInt = input.second;
  return firstInt + secondInt;
}

export function u8Method(input: Input_u8Method): u8 {
  const firstInt = input.first;
  const secondInt = input.second;
  return firstInt + secondInt;
}

export function i16Method(input: Input_i16Method): i16 {
  const firstInt = input.first;
  const secondInt = input.second;
  return firstInt + secondInt;
}

export function u16Method(input: Input_u16Method): u16 {
  const firstInt = input.first;
  const secondInt = input.second;
  return firstInt + secondInt;
}

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
