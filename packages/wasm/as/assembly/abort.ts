/* eslint-disable */

// Abort Execution
@external("wrap", "__wrap_abort")
export declare function __wrap_abort(
  msg_ptr: u32,
  msg_len: u32,
  file_ptr: u32,
  file_len: u32,
  line: u32,
  column: u32
): void;

// Helper for aborting
export function wrap_abort(
  msg: string,
  file: string,
  line: u32,
  column: u32
): void {
  const msgBuf = String.UTF8.encode(msg);
  const fileBuf = String.UTF8.encode(file);
  __wrap_abort(
    changetype<u32>(msgBuf), msgBuf.byteLength,
    changetype<u32>(fileBuf), fileBuf.byteLength,
    line, column
  );
}
