import {
  w3_invoke_args,
  w3_invoke,
  w3_load_env,
  w3_abort,
  w3_sanitize_env,
  InvokeArgs
} from "@web3api/wasm-as";

import {
  queryMethodWrapped,
  objectMethodWrapped
} from "./Query/wrapped";
import {
  env
} from "./env";
import {
  QueryEnv
} from "./QueryEnv";

export function _w3_invoke(method_size: u32, args_size: u32): bool {
  const args: InvokeArgs = w3_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "queryMethod") {
    return w3_invoke(args, queryMethodWrapped);
  }
  else if (args.method == "objectMethod") {
    return w3_invoke(args, objectMethodWrapped);
  }
  else {
    return w3_invoke(args, null);
  }
}

export function _w3_load_env(env_size: u32): void {
  const envBuf = w3_load_env(env_size);
  env = QueryEnv.fromBuffer(envBuf);
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
