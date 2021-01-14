export class BLOCK {
  /** Memory manager info. */
  mmInfo: u32;
}
export const BLOCK_OVERHEAD: usize = offsetof<BLOCK>();
export const BLOCK_MAXSIZE: usize = (1 << 30) - BLOCK_OVERHEAD;
export const E_INDEXOUTOFRANGE: string = "Index out of range";
export const E_INVALIDLENGTH: string = "Invalid length";
