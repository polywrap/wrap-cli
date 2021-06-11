import {
  Input_boolMethod,
  Input_bytesMethod,
  Input_arrayMethod,
  Input_intMethod,
  Input_uIntMethod
} from "./w3";

export function boolMethod(input: Input_boolMethod): bool {
  return input.arg;
}

export function intMethod(input: Input_intMethod): i64 {
  return input.arg;
}

export function uIntMethod(input: Input_uIntMethod): u64 {
  return input.arg;
}

export function bytesMethod(input: Input_bytesMethod): ArrayBuffer {
  return input.arg;
}

export function arrayMethod(input: Input_arrayMethod): string[] {
  return input.arg;
}
