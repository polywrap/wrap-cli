import {
  wrap_invoke_args,
  wrap_invoke,
  wrap_load_env,
  wrap_sanitize_env,
  wrap_abort,
  InvokeArgs
} from "@polywrap/wasm-as";

import {
  moduleMethodWrapped,
  objectMethodWrapped
} from "./Module/wrapped";
import {
  env
} from "./env";
import {
  Env
} from "./Env";

export function _wrap_invoke(method_size: u32, args_size: u32): bool {
  const args: InvokeArgs = wrap_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "moduleMethod") {
    return wrap_invoke(args, moduleMethodWrapped);
  }
  else if (args.method == "objectMethod") {
    return wrap_invoke(args, objectMethodWrapped);
  }
  else {
    return wrap_invoke(args, null);
  }
}

export function _wrap_load_env(env_size: u32): void {
  const envBuf = wrap_load_env(env_size);
  env = Env.fromBuffer(envBuf);
}

export function wrapAbort(
  msg: string | null,
  file: string | null,
  line: u32,
  column: u32
): void {
  wrap_abort(
    msg ? msg : "",
    file ? file : "",
    line,
    column
  );
}
