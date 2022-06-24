import {
  wrap_invoke_args,
  wrap_invoke,
  wrap_abort,
  InvokeArgs
} from "@polywrap/wasm-as";

import {
  moduleMethodWrapped,
  objectMethodWrapped,
  optionalEnvMethodWrapped
} from "./Module/wrapped";

export function _wrap_invoke(method_size: u32, args_size: u32, env_size: u32): bool {
  const args: InvokeArgs = wrap_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "moduleMethod") {
    return wrap_invoke(args, moduleMethodWrapped);
  }
  else if (args.method == "objectMethod") {
    return wrap_invoke(args, (argsBuf: ArrayBuffer) => objectMethodWrapped(argsBuf, env_size));
  }
  else if (args.method == "optionalEnvMethod") {
    return wrap_invoke(args, (argsBuf: ArrayBuffer) => optionalEnvMethodWrapped(argsBuf, env_size));
  }
  else {
    return wrap_invoke(args, null);
  }
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
