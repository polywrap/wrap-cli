import {
  w3_invoke_args,
  w3_invoke,
  w3_load_env,
  w3_sanitize_env,
  w3_abort,
  InvokeArgs
} from "@web3api/wasm-as";

import {
  setDataWithLargeArgsWrapped,
  setDataWithManyArgsWrapped,
  setDataWithManyStructuredArgsWrapped,
  deployContractWrapped,
  localVarMethodWrapped,
  globalVarMethodWrapped,
  subsequentInvokesWrapped
} from "./Mutation/wrapped";

export function _w3_invoke(method_size: u32, args_size: u32): bool {
  const args: InvokeArgs = w3_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "setDataWithLargeArgs") {
    return w3_invoke(args, setDataWithLargeArgsWrapped);
  }
  else if (args.method == "setDataWithManyArgs") {
    return w3_invoke(args, setDataWithManyArgsWrapped);
  }
  else if (args.method == "setDataWithManyStructuredArgs") {
    return w3_invoke(args, setDataWithManyStructuredArgsWrapped);
  }
  else if (args.method == "deployContract") {
    return w3_invoke(args, deployContractWrapped);
  }
  else if (args.method == "localVarMethod") {
    return w3_invoke(args, localVarMethodWrapped);
  }
  else if (args.method == "globalVarMethod") {
    return w3_invoke(args, globalVarMethodWrapped);
  }
  else if (args.method == "subsequentInvokes") {
    return w3_invoke(args, subsequentInvokesWrapped);
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
