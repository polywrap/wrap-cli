import {
  w3_invoke_args,
  w3_invoke,
  w3_load_env,
  w3_sanitize_env,
  w3_abort,
  InvokeArgs
} from "@web3api/wasm-as";

import {
  callContractViewWrapped,
  callContractStaticWrapped,
  getBalanceWrapped,
  encodeParamsWrapped,
  encodeFunctionWrapped,
  solidityPackWrapped,
  solidityKeccak256Wrapped,
  soliditySha256Wrapped,
  getSignerAddressWrapped,
  getSignerBalanceWrapped,
  getSignerTransactionCountWrapped,
  getGasPriceWrapped,
  estimateTransactionGasWrapped,
  estimateContractCallGasWrapped,
  checkAddressWrapped,
  toWeiWrapped,
  toEthWrapped,
  awaitTransactionWrapped,
  waitForEventWrapped,
  getNetworkWrapped
} from "./Query/wrapped";

export function _w3_invoke(method_size: u32, args_size: u32): bool {
  const args: InvokeArgs = w3_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "callContractView") {
    return w3_invoke(args, callContractViewWrapped);
  }
  else if (args.method == "callContractStatic") {
    return w3_invoke(args, callContractStaticWrapped);
  }
  else if (args.method == "getBalance") {
    return w3_invoke(args, getBalanceWrapped);
  }
  else if (args.method == "encodeParams") {
    return w3_invoke(args, encodeParamsWrapped);
  }
  else if (args.method == "encodeFunction") {
    return w3_invoke(args, encodeFunctionWrapped);
  }
  else if (args.method == "solidityPack") {
    return w3_invoke(args, solidityPackWrapped);
  }
  else if (args.method == "solidityKeccak256") {
    return w3_invoke(args, solidityKeccak256Wrapped);
  }
  else if (args.method == "soliditySha256") {
    return w3_invoke(args, soliditySha256Wrapped);
  }
  else if (args.method == "getSignerAddress") {
    return w3_invoke(args, getSignerAddressWrapped);
  }
  else if (args.method == "getSignerBalance") {
    return w3_invoke(args, getSignerBalanceWrapped);
  }
  else if (args.method == "getSignerTransactionCount") {
    return w3_invoke(args, getSignerTransactionCountWrapped);
  }
  else if (args.method == "getGasPrice") {
    return w3_invoke(args, getGasPriceWrapped);
  }
  else if (args.method == "estimateTransactionGas") {
    return w3_invoke(args, estimateTransactionGasWrapped);
  }
  else if (args.method == "estimateContractCallGas") {
    return w3_invoke(args, estimateContractCallGasWrapped);
  }
  else if (args.method == "checkAddress") {
    return w3_invoke(args, checkAddressWrapped);
  }
  else if (args.method == "toWei") {
    return w3_invoke(args, toWeiWrapped);
  }
  else if (args.method == "toEth") {
    return w3_invoke(args, toEthWrapped);
  }
  else if (args.method == "awaitTransaction") {
    return w3_invoke(args, awaitTransactionWrapped);
  }
  else if (args.method == "waitForEvent") {
    return w3_invoke(args, waitForEventWrapped);
  }
  else if (args.method == "getNetwork") {
    return w3_invoke(args, getNetworkWrapped);
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
