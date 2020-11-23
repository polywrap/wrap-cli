// Get Call Arguments
@external("w3", "__w3_call_args")
export declare function __w3_call_args(name_ptr: i32, args_ptr: i32): void;

// Set Call Result
@external("w3", "__w3_call_result")
export declare function __w3_call_result(ptr: i32, len: usize): void;

// Set Call Error
@external("w3", "__w3_call_error")
export declare function __w3_call_error(ptr: i32, len: usize): void;

// Keep track of all callable functions
type CallFunction = (argsBuf: ArrayBuffer) => ArrayBuffer;

const calls = new Map<string, CallFunction>();

export function w3_add_call(name: string, fn: CallFunction): void {
  calls.set(name, fn);
}

// Helper for handling _w3_call
export function w3_call(name_size: usize, args_size: usize): bool {
  const nameBuf = new ArrayBuffer(changetype<i32>(name_size));
  const argsBuf = new ArrayBuffer(changetype<i32>(args_size));
  __w3_call_args(
    changetype<i32>(nameBuf),
    changetype<i32>(argsBuf)
  );

  const name = String.UTF8.decode(nameBuf);
  const fn = calls.has(name) ? calls.get(name) : null;
  if (fn) {
    const result = fn(argsBuf);
    __w3_call_result(
      changetype<i32>(result),
      result.byteLength
    );
    return true;
  } else {
    const message = String.UTF8.encode(
      `Could not find call function "${name}"`
    );
    __w3_call_error(
      changetype<i32>(message),
      message.byteLength
    );
    return false;
  }
}
