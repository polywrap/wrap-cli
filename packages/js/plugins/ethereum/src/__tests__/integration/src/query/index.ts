import {
  Ethereum_Query,
  Ethereum_EventNotification,
  Ethereum_StaticTxResult,
  Ethereum_TxReceipt,
  Input_callContractView,
  Input_callContractStatic,
  Input_encodeParams,
  Input_getSignerAddress,
  Input_getSignerBalance,
  Input_getSignerTransactionCount,
  Input_getGasPrice,
  Input_estimateTransactionGas,
  Input_estimateContractCallGas,
  Input_checkAddress,
  Input_toWei,
  Input_fromWei,
  Input_awaitTransaction,
  Input_waitForEvent
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

export function getSignerAddress(
  input: Input_getSignerAddress
): string {
  return Ethereum_Query.getSignerAddress({
    connection: input.connection
  });
}

export function getSignerBalance(
  input: Input_getSignerBalance
): string {
  return Ethereum_Query.getSignerBalance({
    blockTag: input.blockTag,
    connection: input.connection
  });
}

export function getSignerTransactionCount(
  input: Input_getSignerTransactionCount
): string {
  return Ethereum_Query.getSignerTransactionCount({
    blockTag: input.blockTag,
    connection: input.connection
  });
}

export function getGasPrice(
  input: Input_getGasPrice
): string {
  return Ethereum_Query.getGasPrice({
    connection: input.connection
  });
}

export function estimateTransactionGas(
  input: Input_estimateTransactionGas
): string {
  return Ethereum_Query.estimateTransactionGas({
    tx: input.tx,
    connection: input.connection
  });
}

export function estimateContractCallGas(
  input: Input_estimateContractCallGas
): string {
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
    amount: input.amount
  });
}

export function fromWei(
  input: Input_fromWei
): BigInt {
  return Ethereum_Query.fromWei({
    amount: input.amount
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
