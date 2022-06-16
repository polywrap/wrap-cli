import {
  w3_invoke_args,
  w3_invoke,
  w3_load_env,
  w3_sanitize_env,
  w3_abort,
  InvokeArgs
} from "@web3api/wasm-as";

import {
  mutationEnvWrapped
} from "./Mutation/wrapped";
import {
  env
} from "./env";
import {
  MutationEnv
} from "./MutationEnv";

export function _w3_invoke(method_size: u32, args_size: u32): bool {
  const args: InvokeArgs = w3_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "mutationEnv") {
    return w3_invoke(args, mutationEnvWrapped);
  }
  else {
    return w3_invoke(args, null);
  }
}

export function _w3_load_env(env_size: u32): void {
  const envBuf = w3_load_env(env_size);
  env = MutationEnv.fromBuffer(envBuf);
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
