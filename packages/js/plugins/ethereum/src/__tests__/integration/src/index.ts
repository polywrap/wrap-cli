import {
  Ethereum_Module,
  Ethereum_EventNotification,
  Ethereum_StaticTxResult,
  Ethereum_TxReceipt,
  Ethereum_Network,
  Args_callContractView,
  Args_callContractStatic,
  Args_encodeParams,
  Args_encodeFunction,
  Args_solidityPack,
  Args_solidityKeccak256,
  Args_soliditySha256,
  Args_getSignerAddress,
  Args_getSignerBalance,
  Args_getSignerTransactionCount,
  Args_getGasPrice,
  Args_estimateTransactionGas,
  Args_estimateContractCallGas,
  Args_checkAddress,
  Args_toWei,
  Args_toEth,
  Args_awaitTransaction,
  Args_waitForEvent,
  Args_getNetwork,
  Args_getBalance,
  Ethereum_TxResponse,
  Args_callContractMethod,
  Args_callContractMethodAndWait,
  Args_deployContract,
  Args_sendRPC,
  Args_sendTransaction,
  Args_sendTransactionAndWait,
  Args_signMessage,
  Args_signMessageBytes,
  Args_signTypedData,
  Args_requestAccounts,
} from "./wrap";
import { BigInt } from "@polywrap/wasm-as";

export function callContractView(
  args: Args_callContractView
): string {
  return Ethereum_Module.callContractView({
    address: args.address,
    method: args.method,
    args: args.args,
    connection: args.connection
  }).unwrap();
}

export function callContractStatic(
  args: Args_callContractStatic
): Ethereum_StaticTxResult {
  return Ethereum_Module.callContractStatic({
    address: args.address,
    method: args.method,
    args: args.args,
    connection: args.connection,
    txOverrides: args.txOverrides
  }).unwrap();
}

export function getBalance(
  args: Args_getBalance
): BigInt {
  return Ethereum_Module.getBalance({
    address: args.address,
    blockTag: args.blockTag,
    connection: args.connection
  }).unwrap();
}

export function encodeParams(
  args: Args_encodeParams
): string {
  return Ethereum_Module.encodeParams({
    types: args.types,
    values: args.values
  }).unwrap();
}

export function encodeFunction(
  args: Args_encodeFunction
): string {
  return Ethereum_Module.encodeFunction({
    method: args.method,
    args: args.args
  }).unwrap();
}

export function solidityPack(
  args: Args_solidityPack
): string {
  return Ethereum_Module.solidityPack({
    types: args.types,
    values: args.values
  }).unwrap();
}

export function solidityKeccak256(
  args: Args_solidityKeccak256
): string {
  return Ethereum_Module.solidityKeccak256({
    types: args.types,
    values: args.values
  }).unwrap();
}

export function soliditySha256(
  args: Args_soliditySha256
): string {
  return Ethereum_Module.soliditySha256({
    types: args.types,
    values: args.values
  }).unwrap();
}

export function getSignerAddress(
  args: Args_getSignerAddress
): string {
  return Ethereum_Module.getSignerAddress({
    connection: args.connection
  }).unwrap();
}

export function getSignerBalance(
  args: Args_getSignerBalance
): BigInt {
  return Ethereum_Module.getSignerBalance({
    blockTag: args.blockTag,
    connection: args.connection
  }).unwrap();
}

export function getSignerTransactionCount(
  args: Args_getSignerTransactionCount
): BigInt {
  return Ethereum_Module.getSignerTransactionCount({
    blockTag: args.blockTag,
    connection: args.connection
  }).unwrap();
}

export function getGasPrice(
  args: Args_getGasPrice
): BigInt {
  return Ethereum_Module.getGasPrice({
    connection: args.connection
  }).unwrap();
}

export function estimateTransactionGas(
  args: Args_estimateTransactionGas
): BigInt {
  return Ethereum_Module.estimateTransactionGas({
    tx: args.tx,
    connection: args.connection
  }).unwrap();
}

export function estimateContractCallGas(
  args: Args_estimateContractCallGas
): BigInt {
  return Ethereum_Module.estimateContractCallGas({
    address: args.address,
    method: args.method,
    args: args.args,
    connection: args.connection,
    txOverrides: args.txOverrides
  }).unwrap();
}

export function checkAddress(
  args: Args_checkAddress
): bool {
  return Ethereum_Module.checkAddress({
    address: args.address
  }).unwrap();
}

export function toWei(
  args: Args_toWei
): BigInt {
  return Ethereum_Module.toWei({
    eth: args.eth
  }).unwrap();
}

export function toEth(
  args: Args_toEth
): String {
  return Ethereum_Module.toEth({
    wei: args.wei
  }).unwrap();
}

export function awaitTransaction(
  args: Args_awaitTransaction
): Ethereum_TxReceipt {
  return Ethereum_Module.awaitTransaction({
    txHash: args.txHash,
    confirmations: args.confirmations,
    timeout: args.timeout,
    connection: args.connection
  }).unwrap();
}

export function waitForEvent(
  args: Args_waitForEvent
): Ethereum_EventNotification {
  return Ethereum_Module.waitForEvent({
    address: args.address,
    event: args.event,
    args: args.args,
    timeout: args.timeout,
    connection: args.connection
  }).unwrap();
}

export function getNetwork(
  args: Args_getNetwork
): Ethereum_Network {
  return Ethereum_Module.getNetwork({
    connection: args.connection
  }).unwrap();
}

export function requestAccounts(
  args: Args_requestAccounts
): string[] {
  return Ethereum_Module.requestAccounts({
    connection: args.connection
  }).unwrap();
}

export function callContractMethod(
  args: Args_callContractMethod
): Ethereum_TxResponse {
  return Ethereum_Module.callContractMethod({
    address: args.address,
    method: args.method,
    args: args.args,
    connection: args.connection,
    txOverrides: args.txOverrides
  }).unwrap();
}

export function callContractMethodAndWait(
  args: Args_callContractMethodAndWait
): Ethereum_TxReceipt {
  return Ethereum_Module.callContractMethodAndWait({
    address: args.address,
    method: args.method,
    args: args.args,
    connection: args.connection,
    txOverrides: args.txOverrides
  }).unwrap();
}

export function sendTransaction(
  args: Args_sendTransaction
): Ethereum_TxResponse {
  return Ethereum_Module.sendTransaction({
    tx: args.tx,
    connection: args.connection
  }).unwrap();
}

export function sendTransactionAndWait(
  args: Args_sendTransactionAndWait
): Ethereum_TxReceipt {
  return Ethereum_Module.sendTransactionAndWait({
    tx: args.tx,
    connection: args.connection
  }).unwrap();
}

export function deployContract(
  args: Args_deployContract
): string {
  return Ethereum_Module.deployContract({
    abi: args.abi,
    bytecode: args.bytecode,
    args: args.args,
    connection: args.connection
  }).unwrap();
}

export function signMessage(
  args: Args_signMessage
): string {
  return Ethereum_Module.signMessage({
    message: args.message,
    connection: args.connection
  }).unwrap();
}

export function signMessageBytes(
  args: Args_signMessageBytes
): string {
  return Ethereum_Module.signMessageBytes({
    bytes: args.bytes,
    connection: args.connection
  }).unwrap();
}

export function signTypedData(
  args: Args_signTypedData
): string | null {
  return Ethereum_Module.signTypedData({
    payload: args.payload,
    connection: args.connection
  }).unwrap();
}

export function sendRPC(
  args: Args_sendRPC
): string | null {
  return Ethereum_Module.sendRPC({
    method: args.method,
    params: args.params,
    connection: args.connection
  }).unwrap();
}
