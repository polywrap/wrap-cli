import {
  w3_invoke_args,
  w3_invoke,
  w3_load_env,
  w3_sanitize_env,
  w3_abort,
  InvokeArgs
} from "@web3api/wasm-as";

import {
  method1Wrapped,
  method2Wrapped,
  method3Wrapped,
  method5Wrapped
} from "./Query/wrapped";

export function _w3_invoke(method_size: u32, args_size: u32): bool {
  const args: InvokeArgs = w3_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "method1") {
    return w3_invoke(args, method1Wrapped);
  }
  else if (args.method == "method2") {
    return w3_invoke(args, method2Wrapped);
  }
  else if (args.method == "method3") {
    return w3_invoke(args, method3Wrapped);
  }
  else if (args.method == "method5") {
    return w3_invoke(args, method5Wrapped);
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
