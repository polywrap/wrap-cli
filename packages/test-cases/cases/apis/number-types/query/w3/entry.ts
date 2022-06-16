import {
  w3_invoke_args,
  w3_invoke,
  w3_load_env,
  w3_sanitize_env,
  w3_abort,
  InvokeArgs
} from "@web3api/wasm-as";

import {
  i8MethodWrapped,
  u8MethodWrapped,
  i16MethodWrapped,
  u16MethodWrapped,
  i32MethodWrapped,
  u32MethodWrapped
} from "./Query/wrapped";

export function _w3_invoke(method_size: u32, args_size: u32): bool {
  const args: InvokeArgs = w3_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "i8Method") {
    return w3_invoke(args, i8MethodWrapped);
  }
  else if (args.method == "u8Method") {
    return w3_invoke(args, u8MethodWrapped);
  }
  else if (args.method == "i16Method") {
    return w3_invoke(args, i16MethodWrapped);
  }
  else if (args.method == "u16Method") {
    return w3_invoke(args, u16MethodWrapped);
  }
  else if (args.method == "i32Method") {
    return w3_invoke(args, i32MethodWrapped);
  }
  else if (args.method == "u32Method") {
    return w3_invoke(args, u32MethodWrapped);
  }
  else {
    return w3_invoke(args, null);
  }
}

export function w3Abort(
  msg: string | null,
  file: string | null,
  line: u32,
  column: u32
): void {
  w3_abort(
    msg ? msg : "",
    file ? file : "",
    line,
    column
  );
}
