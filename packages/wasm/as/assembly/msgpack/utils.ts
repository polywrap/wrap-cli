import { Context } from "../debug";

export class BLOCK {
  /** Memory manager info. */
  mmInfo: u32;
}
export const BLOCK_OVERHEAD: u32 = <u32>offsetof<BLOCK>();
export const BLOCK_MAXSIZE: u32 = (1 << 30) - BLOCK_OVERHEAD;
export const E_INDEXOUTOFRANGE = "Index out of range";
export const E_INVALIDLENGTH = "Invalid length";

export function throwByteIndexOutOfRange(
  context: Context,
  method: string,
  length: u32,
  byte_offset: u32,
  byte_length: u32
): void {
  throw new RangeError(
    context.printWithContext(
      method +
        ": " +
        E_INDEXOUTOFRANGE +
        "[length: " +
        length.toString() +
        " byteOffset: " +
        byte_offset.toString() +
        " byteLength: " +
        byte_length.toString() +
        "]"
    )
  );
}

export function throwArrayIndexOutOfRange(
  context: Context,
  method: string,
  length: u32,
  index: u32
): void {
  throw new RangeError(
    context.printWithContext(
      method +
        ": " +
        E_INDEXOUTOFRANGE +
        "[length: " +
        length.toString() +
        " index: " +
        index.toString() +
        "]"
    )
  );
}
