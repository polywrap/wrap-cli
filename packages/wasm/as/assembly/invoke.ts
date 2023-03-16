/* eslint-disable */

// Get Invoke Arguments
@external("wrap", "__wrap_invoke_args")
export declare function __wrap_invoke_args(method_ptr: u32, args_ptr: u32): void;

// Set Invoke Result
@external("wrap", "__wrap_invoke_result")
export declare function __wrap_invoke_result(ptr: u32, len: u32): void;

// Set Invoke Error
@external("wrap", "__wrap_invoke_error")
export declare function __wrap_invoke_error(ptr: u32, len: u32): void;

export class InvokeArgs {
  constructor(
    public method: string,
    public args: ArrayBuffer
  ) { }
}

// Helper for fetching invoke args
export function wrap_invoke_args(method_size: u32, args_size: u32): InvokeArgs {
  const methodBuf = new ArrayBuffer(method_size);
  const argsBuf = new ArrayBuffer(args_size);
  __wrap_invoke_args(
    changetype<u32>(methodBuf),
    changetype<u32>(argsBuf)
  );
  const method = String.UTF8.decode(methodBuf);

  return new InvokeArgs(
    method,
    argsBuf
  );
}

// Helper for handling __wrap_invoke_result
export function wrap_invoke_result(result: ArrayBuffer): void {
  __wrap_invoke_result(
    changetype<u32>(result),
    result.byteLength
  );
}


// Helper for handling __wrap_invoke_error
export function wrap_invoke_error(message: string): void {
  const messageBuf = String.UTF8.encode(message);
  __wrap_invoke_error(
    changetype<u32>(messageBuf),
    messageBuf.byteLength
  );
}
