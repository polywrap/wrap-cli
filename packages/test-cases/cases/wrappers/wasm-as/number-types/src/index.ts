import {
  Args_i8Method,
  Args_u8Method,
  Args_i16Method,
  Args_u16Method,
  Args_i32Method,
  Args_u32Method,
} from "./wrap";

export function i8Method(args: Args_i8Method): i8 {
  const firstInt = args.first;
  const secondInt = args.second;
  return firstInt + secondInt;
}

export function u8Method(args: Args_u8Method): u8 {
  const firstInt = args.first;
  const secondInt = args.second;
  return firstInt + secondInt;
}

export function i16Method(args: Args_i16Method): i16 {
  const firstInt = args.first;
  const secondInt = args.second;
  return firstInt + secondInt;
}

export function u16Method(args: Args_u16Method): u16 {
  const firstInt = args.first;
  const secondInt = args.second;
  return firstInt + secondInt;
}

export function i32Method(args: Args_i32Method): i32 {
  const firstInt = args.first;
  const secondInt = args.second;
  return firstInt + secondInt;
}

export function u32Method(args: Args_u32Method): u32 {
  const firstInt = args.first;
  const secondInt = args.second;
  return firstInt + secondInt;
}
