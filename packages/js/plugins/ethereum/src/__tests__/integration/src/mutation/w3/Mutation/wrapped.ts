import {
  callContractMethod,
  callContractMethodAndWait,
  sendTransaction,
  sendTransactionAndWait,
  deployContract,
  signMessage,
  sendRPC
} from "../../index";
import {
  deserializecallContractMethodArgs,
  serializecallContractMethodResult,
  deserializecallContractMethodAndWaitArgs,
  serializecallContractMethodAndWaitResult,
  deserializesendTransactionArgs,
  serializesendTransactionResult,
  deserializesendTransactionAndWaitArgs,
  serializesendTransactionAndWaitResult,
  deserializedeployContractArgs,
  serializedeployContractResult,
  deserializesignMessageArgs,
  serializesignMessageResult,
  deserializesendRPCArgs,
  serializesendRPCResult
} from "./serialization";

export function callContractMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializecallContractMethodArgs(argsBuf);
  const result = callContractMethod({
    address: args.address,
    method: args.method,
    args: args.args,
    connection: args.connection,
    txOverrides: args.txOverrides
  });
  return serializecallContractMethodResult(result);
}

export function callContractMethodAndWaitWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializecallContractMethodAndWaitArgs(argsBuf);
  const result = callContractMethodAndWait({
    address: args.address,
    method: args.method,
    args: args.args,
    connection: args.connection,
    txOverrides: args.txOverrides
  });
  return serializecallContractMethodAndWaitResult(result);
}

export function sendTransactionWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesendTransactionArgs(argsBuf);
  const result = sendTransaction({
    tx: args.tx,
    connection: args.connection
  });
  return serializesendTransactionResult(result);
}

export function sendTransactionAndWaitWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesendTransactionAndWaitArgs(argsBuf);
  const result = sendTransactionAndWait({
    tx: args.tx,
    connection: args.connection
  });
  return serializesendTransactionAndWaitResult(result);
}

export function deployContractWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializedeployContractArgs(argsBuf);
  const result = deployContract({
    abi: args.abi,
    bytecode: args.bytecode,
    args: args.args,
    connection: args.connection
  });
  return serializedeployContractResult(result);
}

export function signMessageWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesignMessageArgs(argsBuf);
  const result = signMessage({
    message: args.message,
    connection: args.connection
  });
  return serializesignMessageResult(result);
}

export function sendRPCWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesendRPCArgs(argsBuf);
  const result = sendRPC({
    method: args.method,
    params: args.params,
    connection: args.connection
  });
  return serializesendRPCResult(result);
}
