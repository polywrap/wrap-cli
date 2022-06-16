import {
  Input_boolMethod,
  Input_bytesMethod,
  Input_arrayMethod,
  Input_intMethod,
  Input_uIntMethod
} from "./wrap";

export function boolMethod(input: Input_boolMethod): bool {
  return input.arg;
}

export function intMethod(input: Input_intMethod): i32 {
  return input.arg;
}

export function uIntMethod(input: Input_uIntMethod): u32 {
  return input.arg;
}

export function bytesMethod(input: Input_bytesMethod): ArrayBuffer {
  return input.arg;
}

export function arrayMethod(input: Input_arrayMethod): string[] {
  return input.arg;
}
