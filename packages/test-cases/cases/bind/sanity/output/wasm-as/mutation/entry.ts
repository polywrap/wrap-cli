import {
  w3_invoke_args,
  w3_invoke,
  w3_abort,
  w3_sanitize_env,
  InvokeArgs
} from "@web3api/wasm-as";

import {
  mutationMethodWrapped,
  objectMethodWrapped
} from "./Mutation/wrapped";
import {
  env
} from "./environment";
import {
  MutationEnv
} from "./MutationEnv";

export function _w3_invoke(method_size: u32, args_size: u32): bool {
  const args: InvokeArgs = w3_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "mutationMethod") {
    return w3_invoke(args, mutationMethodWrapped);
  }
  else if (args.method == "objectMethod") {
    return w3_invoke(args, objectMethodWrapped);
  }
  else {
    return w3_invoke(args, null);
  }
}

@external("w3", "__w3_load_env")
export declare function __w3_load_env(enviroment_ptr: u32): void;

export function _w3_load_env(environment_size: u32): void {
  const environmentBuf = new ArrayBuffer(environment_size);
  __w3_load_env(changetype<u32>(environmentBuf));

  env = MutationEnv.fromBuffer(environmentBuf);
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
