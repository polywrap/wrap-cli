import {
  w3_invoke_args,
  w3_invoke,
  w3_load_env,
  w3_sanitize_env,
  w3_abort,
  InvokeArgs
} from "@web3api/wasm-as";

import {
  callContractMethodWrapped,
  callContractMethodAndWaitWrapped,
  sendTransactionWrapped,
  sendTransactionAndWaitWrapped,
  deployContractWrapped,
  signMessageWrapped,
  sendRPCWrapped
} from "./Mutation/wrapped";

export function _w3_invoke(method_size: u32, args_size: u32): bool {
  const args: InvokeArgs = w3_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "callContractMethod") {
    return w3_invoke(args, callContractMethodWrapped);
  }
  else if (args.method == "callContractMethodAndWait") {
    return w3_invoke(args, callContractMethodAndWaitWrapped);
  }
  else if (args.method == "sendTransaction") {
    return w3_invoke(args, sendTransactionWrapped);
  }
  else if (args.method == "sendTransactionAndWait") {
    return w3_invoke(args, sendTransactionAndWaitWrapped);
  }
  else if (args.method == "deployContract") {
    return w3_invoke(args, deployContractWrapped);
  }
  else if (args.method == "signMessage") {
    return w3_invoke(args, signMessageWrapped);
  }
  else if (args.method == "sendRPC") {
    return w3_invoke(args, sendRPCWrapped);
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
