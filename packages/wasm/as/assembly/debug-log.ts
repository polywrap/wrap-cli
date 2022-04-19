/* eslint-disable */

// Debug Log
@external("w3", "__w3_debug_log")
export declare function __w3_debug_log(
  ptr: u32,
  len: u32,
): void;

// Helper for debug logging
export function w3_debug_log(msg: string): void {
  const msgBuf = String.UTF8.encode(msg);
  __w3_debug_log(
    changetype<u32>(msgBuf), msgBuf.byteLength
  );
}
