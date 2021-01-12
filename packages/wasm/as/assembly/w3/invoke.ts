/* eslint-disable */

// Get Invoke Arguments
@external("w3", "__w3_invoke_args")
export declare function __w3_invoke_args(method_ptr: usize, args_ptr: usize): void;

// Set Invoke Result
@external("w3", "__w3_invoke_result")
export declare function __w3_invoke_result(ptr: usize, len: usize): void;

// Set Invoke Error
@external("w3", "__w3_invoke_error")
export declare function __w3_invoke_error(ptr: usize, len: usize): void;

// Keep track of all invokable functions
type InvokeFunction = (argsBuf: ArrayBuffer) => ArrayBuffer;

const invokes = new Map<string, InvokeFunction>();

export function w3_add_invoke(method: string, fn: InvokeFunction): void {
  invokes.set(method, fn);
}

// Helper for handling _w3_invoke
export function w3_invoke(method_size: usize, args_size: usize): bool {
  const methodBuf = new ArrayBuffer(changetype<usize>(method_size));
  const argsBuf = new ArrayBuffer(changetype<usize>(args_size));
  __w3_invoke_args(
    changetype<usize>(methodBuf),
    changetype<usize>(argsBuf)
  );

  const method = String.UTF8.decode(methodBuf);
  const fn = invokes.has(method) ? invokes.get(method) : null;
  if (fn) {
    const result = fn(argsBuf);
    __w3_invoke_result(
      changetype<usize>(result),
      result.byteLength
    );
    return true;
  } else {
    const message = String.UTF8.encode(
      `Could not find invoke function "${method}"`
    );
    __w3_invoke_error(
      changetype<usize>(message),
      message.byteLength
    );
    return false;
  }
}
