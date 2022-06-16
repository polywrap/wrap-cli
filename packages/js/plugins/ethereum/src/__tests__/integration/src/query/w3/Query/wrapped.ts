import {
  callContractView,
  callContractStatic,
  getBalance,
  encodeParams,
  encodeFunction,
  solidityPack,
  solidityKeccak256,
  soliditySha256,
  getSignerAddress,
  getSignerBalance,
  getSignerTransactionCount,
  getGasPrice,
  estimateTransactionGas,
  estimateContractCallGas,
  checkAddress,
  toWei,
  toEth,
  awaitTransaction,
  waitForEvent,
  getNetwork
} from "../../index";
import {
  deserializecallContractViewArgs,
  serializecallContractViewResult,
  deserializecallContractStaticArgs,
  serializecallContractStaticResult,
  deserializegetBalanceArgs,
  serializegetBalanceResult,
  deserializeencodeParamsArgs,
  serializeencodeParamsResult,
  deserializeencodeFunctionArgs,
  serializeencodeFunctionResult,
  deserializesolidityPackArgs,
  serializesolidityPackResult,
  deserializesolidityKeccak256Args,
  serializesolidityKeccak256Result,
  deserializesoliditySha256Args,
  serializesoliditySha256Result,
  deserializegetSignerAddressArgs,
  serializegetSignerAddressResult,
  deserializegetSignerBalanceArgs,
  serializegetSignerBalanceResult,
  deserializegetSignerTransactionCountArgs,
  serializegetSignerTransactionCountResult,
  deserializegetGasPriceArgs,
  serializegetGasPriceResult,
  deserializeestimateTransactionGasArgs,
  serializeestimateTransactionGasResult,
  deserializeestimateContractCallGasArgs,
  serializeestimateContractCallGasResult,
  deserializecheckAddressArgs,
  serializecheckAddressResult,
  deserializetoWeiArgs,
  serializetoWeiResult,
  deserializetoEthArgs,
  serializetoEthResult,
  deserializeawaitTransactionArgs,
  serializeawaitTransactionResult,
  deserializewaitForEventArgs,
  serializewaitForEventResult,
  deserializegetNetworkArgs,
  serializegetNetworkResult
} from "./serialization";

export function callContractViewWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializecallContractViewArgs(argsBuf);
  const result = callContractView({
    address: args.address,
    method: args.method,
    args: args.args,
    connection: args.connection
  });
  return serializecallContractViewResult(result);
}

export function callContractStaticWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializecallContractStaticArgs(argsBuf);
  const result = callContractStatic({
    address: args.address,
    method: args.method,
    args: args.args,
    connection: args.connection,
    txOverrides: args.txOverrides
  });
  return serializecallContractStaticResult(result);
}

export function getBalanceWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializegetBalanceArgs(argsBuf);
  const result = getBalance({
    address: args.address,
    blockTag: args.blockTag,
    connection: args.connection
  });
  return serializegetBalanceResult(result);
}

export function encodeParamsWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeencodeParamsArgs(argsBuf);
  const result = encodeParams({
    types: args.types,
    values: args.values
  });
  return serializeencodeParamsResult(result);
}

export function encodeFunctionWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeencodeFunctionArgs(argsBuf);
  const result = encodeFunction({
    method: args.method,
    args: args.args
  });
  return serializeencodeFunctionResult(result);
}

export function solidityPackWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesolidityPackArgs(argsBuf);
  const result = solidityPack({
    types: args.types,
    values: args.values
  });
  return serializesolidityPackResult(result);
}

export function solidityKeccak256Wrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesolidityKeccak256Args(argsBuf);
  const result = solidityKeccak256({
    types: args.types,
    values: args.values
  });
  return serializesolidityKeccak256Result(result);
}

export function soliditySha256Wrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesoliditySha256Args(argsBuf);
  const result = soliditySha256({
    types: args.types,
    values: args.values
  });
  return serializesoliditySha256Result(result);
}

export function getSignerAddressWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializegetSignerAddressArgs(argsBuf);
  const result = getSignerAddress({
    connection: args.connection
  });
  return serializegetSignerAddressResult(result);
}

export function getSignerBalanceWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializegetSignerBalanceArgs(argsBuf);
  const result = getSignerBalance({
    blockTag: args.blockTag,
    connection: args.connection
  });
  return serializegetSignerBalanceResult(result);
}

export function getSignerTransactionCountWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializegetSignerTransactionCountArgs(argsBuf);
  const result = getSignerTransactionCount({
    blockTag: args.blockTag,
    connection: args.connection
  });
  return serializegetSignerTransactionCountResult(result);
}

export function getGasPriceWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializegetGasPriceArgs(argsBuf);
  const result = getGasPrice({
    connection: args.connection
  });
  return serializegetGasPriceResult(result);
}

export function estimateTransactionGasWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeestimateTransactionGasArgs(argsBuf);
  const result = estimateTransactionGas({
    tx: args.tx,
    connection: args.connection
  });
  return serializeestimateTransactionGasResult(result);
}

export function estimateContractCallGasWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeestimateContractCallGasArgs(argsBuf);
  const result = estimateContractCallGas({
    address: args.address,
    method: args.method,
    args: args.args,
    connection: args.connection,
    txOverrides: args.txOverrides
  });
  return serializeestimateContractCallGasResult(result);
}

export function checkAddressWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializecheckAddressArgs(argsBuf);
  const result = checkAddress({
    address: args.address
  });
  return serializecheckAddressResult(result);
}

export function toWeiWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializetoWeiArgs(argsBuf);
  const result = toWei({
    eth: args.eth
  });
  return serializetoWeiResult(result);
}

export function toEthWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializetoEthArgs(argsBuf);
  const result = toEth({
    wei: args.wei
  });
  return serializetoEthResult(result);
}

export function awaitTransactionWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeawaitTransactionArgs(argsBuf);
  const result = awaitTransaction({
    txHash: args.txHash,
    confirmations: args.confirmations,
    timeout: args.timeout,
    connection: args.connection
  });
  return serializeawaitTransactionResult(result);
}

export function waitForEventWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializewaitForEventArgs(argsBuf);
  const result = waitForEvent({
    address: args.address,
    event: args.event,
    args: args.args,
    timeout: args.timeout,
    connection: args.connection
  });
  return serializewaitForEventResult(result);
}

export function getNetworkWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializegetNetworkArgs(argsBuf);
  const result = getNetwork({
    connection: args.connection
  });
  return serializegetNetworkResult(result);
}
