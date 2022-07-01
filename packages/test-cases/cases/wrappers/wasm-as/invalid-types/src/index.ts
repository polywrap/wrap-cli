import {
  Args_boolMethod,
  Args_bytesMethod,
  Args_arrayMethod,
  Args_intMethod,
  Args_uIntMethod
} from "./wrap";

export function boolMethod(args: Args_boolMethod): bool {
  return args.arg;
}

export function intMethod(args: Args_intMethod): i32 {
  return args.arg;
}

export function uIntMethod(args: Args_uIntMethod): u32 {
  return args.arg;
}

export function bytesMethod(args: Args_bytesMethod): ArrayBuffer {
  return args.arg;
}

export function arrayMethod(args: Args_arrayMethod): string[] {
  return args.arg;
}
