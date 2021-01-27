/* eslint-disable */

// Get Invoke Arguments
@external("w3", "__w3_invoke_args")
export declare function __w3_invoke_args(method_ptr: u32, args_ptr: u32): void;

// Set Invoke Result
@external("w3", "__w3_invoke_result")
export declare function __w3_invoke_result(ptr: u32, len: u32): void;

// Set Invoke Error
@external("w3", "__w3_invoke_error")
export declare function __w3_invoke_error(ptr: u32, len: u32): void;

// Keep track of all invokable functions
export type InvokeFunction = (argsBuf: ArrayBuffer) => ArrayBuffer;

const invokes = new Map<string, InvokeFunction>();

export function w3_add_invoke(method: string, fn: InvokeFunction): void {
  invokes.set(method, fn);
}

// Helper for handling _w3_invoke
export function w3_invoke(method_size: u32, args_size: u32): bool {
  const methodBuf = new ArrayBuffer(method_size);
  const argsBuf = new ArrayBuffer(args_size);
  __w3_invoke_args(
    changetype<u32>(methodBuf),
    changetype<u32>(argsBuf)
  );

  const method = String.UTF8.decode(methodBuf);
  const fn = invokes.has(method) ? invokes.get(method) : null;
  if (fn) {
    const result = fn(argsBuf);
    __w3_invoke_result(
      changetype<u32>(result),
      result.byteLength
    );
    return true;
  } else {
    const message = String.UTF8.encode(
      `Could not find invoke function "${method}"`
    );
    __w3_invoke_error(
      changetype<u32>(message),
      message.byteLength
    );
    return false;
  }
}
