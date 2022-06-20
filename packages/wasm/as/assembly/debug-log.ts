/* eslint-disable */

// Debug Log
@external("wrap", "__wrap_debug_log")
export declare function __wrap_debug_log(
  ptr: u32,
  len: u32,
): void;

// Helper for debug logging
export function wrap_debug_log(msg: string): void {
  const msgBuf = String.UTF8.encode(msg);
  __wrap_debug_log(
    changetype<u32>(msgBuf), msgBuf.byteLength
  );
}
