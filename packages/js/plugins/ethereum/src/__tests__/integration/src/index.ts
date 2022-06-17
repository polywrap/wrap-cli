import {
  Ethereum_Module,
  Ethereum_EventNotification,
  Ethereum_StaticTxResult,
  Ethereum_TxReceipt,
  Ethereum_Network,
  Input_callContractView,
  Input_callContractStatic,
  Input_encodeParams,
  Input_encodeFunction,
  Input_solidityPack,
  Input_solidityKeccak256,
  Input_soliditySha256,
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
  Input_getNetwork,
  Input_getBalance,
  Ethereum_TxResponse,
  Input_callContractMethod,
  Input_callContractMethodAndWait,
  Input_deployContract,
  Input_sendRPC,
  Input_sendTransaction,
  Input_sendTransactionAndWait,
  Input_signMessage
} from "./wrap";
import { BigInt } from "@polywrap/wasm-as";

export function callContractView(
  input: Input_callContractView
): string {
  return Ethereum_Module.callContractView({
    address: input.address,
    method: input.method,
    args: input.args,
    connection: input.connection
  }).unwrap();
}

export function callContractStatic(
  input: Input_callContractStatic
): Ethereum_StaticTxResult {
  return Ethereum_Module.callContractStatic({
    address: input.address,
    method: input.method,
    args: input.args,
    connection: input.connection,
    txOverrides: input.txOverrides
  }).unwrap();
}

export function getBalance(
  input: Input_getBalance
): BigInt {
  return Ethereum_Module.getBalance({
    address: input.address,
    blockTag: input.blockTag,
    connection: input.connection
  }).unwrap();
}

export function encodeParams(
  input: Input_encodeParams
): string {
  return Ethereum_Module.encodeParams({
    types: input.types,
    values: input.values
  }).unwrap();
}

export function encodeFunction(
  input: Input_encodeFunction
): string {
  return Ethereum_Module.encodeFunction({
    method: input.method,
    args: input.args
  }).unwrap();
}

export function solidityPack(
  input: Input_solidityPack
): string {
  return Ethereum_Module.solidityPack({
    types: input.types,
    values: input.values
  }).unwrap();
}

export function solidityKeccak256(
  input: Input_solidityKeccak256
): string {
  return Ethereum_Module.solidityKeccak256({
    types: input.types,
    values: input.values
  }).unwrap();
}

export function soliditySha256(
  input: Input_soliditySha256
): string {
  return Ethereum_Module.soliditySha256({
    types: input.types,
    values: input.values
  }).unwrap();
}

export function getSignerAddress(
  input: Input_getSignerAddress
): string {
  return Ethereum_Module.getSignerAddress({
    connection: input.connection
  }).unwrap();
}

export function getSignerBalance(
  input: Input_getSignerBalance
): BigInt {
  return Ethereum_Module.getSignerBalance({
    blockTag: input.blockTag,
    connection: input.connection
  }).unwrap();
}

export function getSignerTransactionCount(
  input: Input_getSignerTransactionCount
): BigInt {
  return Ethereum_Module.getSignerTransactionCount({
    blockTag: input.blockTag,
    connection: input.connection
  }).unwrap();
}

export function getGasPrice(
  input: Input_getGasPrice
): BigInt {
  return Ethereum_Module.getGasPrice({
    connection: input.connection
  }).unwrap();
}

export function estimateTransactionGas(
  input: Input_estimateTransactionGas
): BigInt {
  return Ethereum_Module.estimateTransactionGas({
    tx: input.tx,
    connection: input.connection
  }).unwrap();
}

export function estimateContractCallGas(
  input: Input_estimateContractCallGas
): BigInt {
  return Ethereum_Module.estimateContractCallGas({
    address: input.address,
    method: input.method,
    args: input.args,
    connection: input.connection,
    txOverrides: input.txOverrides
  }).unwrap();
}

export function checkAddress(
  input: Input_checkAddress
): bool {
  return Ethereum_Module.checkAddress({
    address: input.address
  }).unwrap();
}

export function toWei(
  input: Input_toWei
): BigInt {
  return Ethereum_Module.toWei({
    eth: input.eth
  }).unwrap();
}

export function toEth(
  input: Input_toEth
): String {
  return Ethereum_Module.toEth({
    wei: input.wei
  }).unwrap();
}

export function awaitTransaction(
  input: Input_awaitTransaction
): Ethereum_TxReceipt {
  return Ethereum_Module.awaitTransaction({
    txHash: input.txHash,
    confirmations: input.confirmations,
    timeout: input.timeout,
    connection: input.connection
  }).unwrap();
}

export function waitForEvent(
  input: Input_waitForEvent
): Ethereum_EventNotification {
  return Ethereum_Module.waitForEvent({
    address: input.address,
    event: input.event,
    args: input.args,
    timeout: input.timeout,
    connection: input.connection
  }).unwrap();
}

export function getNetwork(
  input: Input_getNetwork
): Ethereum_Network {
  return Ethereum_Module.getNetwork({
    connection: input.connection
  }).unwrap();
}

export function callContractMethod(
  input: Input_callContractMethod
): Ethereum_TxResponse {
  return Ethereum_Module.callContractMethod({
    address: input.address,
    method: input.method,
    args: input.args,
    connection: input.connection,
    txOverrides: input.txOverrides
  }).unwrap();
}

export function callContractMethodAndWait(
  input: Input_callContractMethodAndWait
): Ethereum_TxReceipt {
  return Ethereum_Module.callContractMethodAndWait({
    address: input.address,
    method: input.method,
    args: input.args,
    connection: input.connection,
    txOverrides: input.txOverrides
  }).unwrap();
}

export function sendTransaction(
  input: Input_sendTransaction
): Ethereum_TxResponse {
  return Ethereum_Module.sendTransaction({
    tx: input.tx,
    connection: input.connection
  }).unwrap();
}

export function sendTransactionAndWait(
  input: Input_sendTransactionAndWait
): Ethereum_TxReceipt {
  return Ethereum_Module.sendTransactionAndWait({
    tx: input.tx,
    connection: input.connection
  }).unwrap();
}

export function deployContract(
  input: Input_deployContract
): string {
  return Ethereum_Module.deployContract({
    abi: input.abi,
    bytecode: input.bytecode,
    args: input.args,
    connection: input.connection
  }).unwrap();
}

export function signMessage(
  input: Input_signMessage
): string {
  return Ethereum_Module.signMessage({
    message: input.message,
    connection: input.connection
  }).unwrap();
}

export function sendRPC(
  input: Input_sendRPC
): string | null {
  return Ethereum_Module.sendRPC({
    method: input.method,
    params: input.params,
    connection: input.connection
  }).unwrap();
}
