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

// Keep track of all invokable functions
export type InvokeFunction = (args_buf: ArrayBuffer, env_size: u32) => ArrayBuffer;

export class InvokeArgs {
  constructor(
    public method: string,
    public args: ArrayBuffer,
    public env_size: u32
  ) { }
}

// Helper for fetching invoke args
export function wrap_invoke_args(method_size: u32, args_size: u32, env_size: u32): InvokeArgs {
  const methodBuf = new ArrayBuffer(method_size);
  const argsBuf = new ArrayBuffer(args_size);
  __wrap_invoke_args(
    changetype<u32>(methodBuf),
    changetype<u32>(argsBuf)
  );
  const method = String.UTF8.decode(methodBuf);

  return new InvokeArgs(
    method,
    argsBuf,
    env_size
  );
}

// Helper for handling _wrap_invoke
export function wrap_invoke(args: InvokeArgs, fn: InvokeFunction | null): bool {
  if (fn) {
    const result = fn(args.args, args.env_size);
    __wrap_invoke_result(
      changetype<u32>(result),
      result.byteLength
    );
    return true;
  } else {
    const message = String.UTF8.encode(
      `Could not find invoke function "${args.method}"`
    );
    __wrap_invoke_error(
      changetype<u32>(message),
      message.byteLength
    );
    return false;
  }
}
