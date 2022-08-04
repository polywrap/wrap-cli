import { Args_add, Args_sub } from "./wrap";

export function add(args: Args_add): i32 {
  return args.a + args.b;
}

export function sub(args: Args_sub): i32 {
  return args.a - args.b;
}
