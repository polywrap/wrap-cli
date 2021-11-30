import {
  Ethereum_Query,
  Ethereum_EventNotification,
  Ethereum_StaticTxResult,
  Ethereum_TxReceipt,
  Ethereum_Network,
  Input_callContractView,
  Input_callContractStatic,
  Input_encodeParams,
  Input_encodeFunction,
  Input_getSignerAddress,
  Input_getSignerBalance,
  Input_getSignerTransactionCount,
  Input_getGasPrice,
  Input_estimateTransactionGas,
  Input_estimateContractCallGas,
  Input_checkAddress,
  Input_toWei,
  Input_toEth,
  Input_awaitTransaction,
  Input_waitForEvent,
  Input_getNetwork
} from "./w3";
import { BigInt } from "@web3api/wasm-as";

export function callContractView(
  input: Input_callContractView
): string {
  return Ethereum_Query.callContractView({
    address: input.address,
    method: input.method,
    args: input.args,
    connection: input.connection
  });
}

export function callContractStatic(
  input: Input_callContractStatic
): Ethereum_StaticTxResult {
  return Ethereum_Query.callContractStatic({
    address: input.address,
    method: input.method,
    args: input.args,
    connection: input.connection,
    txOverrides: input.txOverrides
  });
}

export function encodeParams(
  input: Input_encodeParams
): string {
  return Ethereum_Query.encodeParams({
    types: input.types,
    values: input.values
  });
}

export function encodeFunction(
  input: Input_encodeFunction
): string {
  return Ethereum_Query.encodeFunction({
    method: input.method,
    args: input.args
  });
}

export function getSignerAddress(
  input: Input_getSignerAddress
): string {
  return Ethereum_Query.getSignerAddress({
    connection: input.connection
  });
}

export function getSignerBalance(
  input: Input_getSignerBalance
): BigInt {
  return Ethereum_Query.getSignerBalance({
    blockTag: input.blockTag,
    connection: input.connection
  });
}

export function getSignerTransactionCount(
  input: Input_getSignerTransactionCount
): BigInt {
  return Ethereum_Query.getSignerTransactionCount({
    blockTag: input.blockTag,
    connection: input.connection
  });
}

export function getGasPrice(
  input: Input_getGasPrice
): BigInt {
  return Ethereum_Query.getGasPrice({
    connection: input.connection
  });
}

export function estimateTransactionGas(
  input: Input_estimateTransactionGas
): BigInt {
  return Ethereum_Query.estimateTransactionGas({
    tx: input.tx,
    connection: input.connection
  });
}

export function estimateContractCallGas(
  input: Input_estimateContractCallGas
): BigInt {
  return Ethereum_Query.estimateContractCallGas({
    address: input.address,
    method: input.method,
    args: input.args,
    connection: input.connection,
    txOverrides: input.txOverrides
  });
}

export function checkAddress(
  input: Input_checkAddress
): bool {
  return Ethereum_Query.checkAddress({
    address: input.address
  });
}

export function toWei(
  input: Input_toWei
): BigInt {
  return Ethereum_Query.toWei({
    eth: input.eth
  });
}

export function toEth(
  input: Input_toEth
): String {
  return Ethereum_Query.toEth({
    wei: input.wei
  });
}

export function awaitTransaction(
  input: Input_awaitTransaction
): Ethereum_TxReceipt {
  return Ethereum_Query.awaitTransaction({
    txHash: input.txHash,
    confirmations: input.confirmations,
    timeout: input.timeout,
    connection: input.connection
  });
}

export function waitForEvent(
  input: Input_waitForEvent
): Ethereum_EventNotification {
  return Ethereum_Query.waitForEvent({
    address: input.address,
    event: input.event,
    args: input.args,
    timeout: input.timeout,
    connection: input.connection
  });
}

export function getNetwork(
  input: Input_getNetwork
): Ethereum_Network {
  return Ethereum_Query.getNetwork({
    connection: input.connection
  });
}
