import {
  Ethereum_Mutation,
  Ethereum_TxResponse,
  Ethereum_TxReceipt,
  Input_callContractMethod,
  Input_callContractMethodAndWait,
  Input_sendTransaction,
  Input_sendTransactionAndWait,
  Input_deployContract,
  Input_signMessage,
  Input_sendRPC
} from "./w3";

export function callContractMethod(
  input: Input_callContractMethod
): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
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
  return Ethereum_Mutation.callContractMethodAndWait({
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
  return Ethereum_Mutation.sendTransaction({
    tx: input.tx,
    connection: input.connection
  }).unwrap();
}

export function sendTransactionAndWait(
  input: Input_sendTransactionAndWait
): Ethereum_TxReceipt {
  return Ethereum_Mutation.sendTransactionAndWait({
    tx: input.tx,
    connection: input.connection
  }).unwrap();
}

export function deployContract(
  input: Input_deployContract
): string {
  return Ethereum_Mutation.deployContract({
    abi: input.abi,
    bytecode: input.bytecode,
    args: input.args,
    connection: input.connection
  }).unwrap();
}

export function signMessage(
  input: Input_signMessage
): string {
  return Ethereum_Mutation.signMessage({
    message: input.message,
    connection: input.connection
  }).unwrap();
}

export function sendRPC(
  input: Input_sendRPC
): string | null {
  return Ethereum_Mutation.sendRPC({
    method: input.method,
    params: input.params,
    connection: input.connection
  }).unwrap();
}
