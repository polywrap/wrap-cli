/* eslint-disable */

// Get Invoke Arguments
@external("w3", "__w3_invoke_args")
export declare function __w3_invoke_args(name_ptr: usize, args_ptr: usize): void;

// Set Invoke Result
@external("w3", "__w3_invoke_result")
export declare function __w3_invoke_result(ptr: usize, len: usize): void;

// Set Invoke Error
@external("w3", "__w3_invoke_error")
export declare function __w3_invoke_error(ptr: usize, len: usize): void;

// Keep track of all invokable functions
type InvokeFunction = (argsBuf: ArrayBuffer) => ArrayBuffer;

const invokes = new Map<string, InvokeFunction>();

export function w3_add_invoke(name: string, fn: InvokeFunction): void {
  invokes.set(name, fn);
}

// Helper for handling _w3_invoke
export function w3_invoke(name_size: usize, args_size: usize): bool {
  const nameBuf = new ArrayBuffer(changetype<usize>(name_size));
  const argsBuf = new ArrayBuffer(changetype<usize>(args_size));
  __w3_invoke_args(
    changetype<usize>(nameBuf),
    changetype<usize>(argsBuf)
  );

  const name = String.UTF8.decode(nameBuf);
  const fn = invokes.has(name) ? invokes.get(name) : null;
  if (fn) {
    const result = fn(argsBuf);
    __w3_invoke_result(
      changetype<usize>(result),
      result.byteLength
    );
    return true;
  } else {
    const message = String.UTF8.encode(
      `Could not find invoke function "${name}"`
    );
    __w3_invoke_error(
      changetype<usize>(message),
      message.byteLength
    );
    return false;
  }
}
