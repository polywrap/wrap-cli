import {
  setDataWithLargeArgs,
  setDataWithManyArgs,
  setDataWithManyStructuredArgs,
  deployContract,
  localVarMethod,
  globalVarMethod,
  subsequentInvokes
} from "../../index";
import {
  deserializesetDataWithLargeArgsArgs,
  serializesetDataWithLargeArgsResult,
  deserializesetDataWithManyArgsArgs,
  serializesetDataWithManyArgsResult,
  deserializesetDataWithManyStructuredArgsArgs,
  serializesetDataWithManyStructuredArgsResult,
  deserializedeployContractArgs,
  serializedeployContractResult,
  deserializelocalVarMethodArgs,
  serializelocalVarMethodResult,
  deserializeglobalVarMethodArgs,
  serializeglobalVarMethodResult,
  deserializesubsequentInvokesArgs,
  serializesubsequentInvokesResult
} from "./serialization";

export function setDataWithLargeArgsWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesetDataWithLargeArgsArgs(argsBuf);
  const result = setDataWithLargeArgs({
    address: args.address,
    value: args.value,
    connection: args.connection
  });
  return serializesetDataWithLargeArgsResult(result);
}

export function setDataWithManyArgsWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesetDataWithManyArgsArgs(argsBuf);
  const result = setDataWithManyArgs({
    address: args.address,
    valueA: args.valueA,
    valueB: args.valueB,
    valueC: args.valueC,
    valueD: args.valueD,
    valueE: args.valueE,
    valueF: args.valueF,
    valueG: args.valueG,
    valueH: args.valueH,
    valueI: args.valueI,
    valueJ: args.valueJ,
    valueK: args.valueK,
    valueL: args.valueL,
    connection: args.connection
  });
  return serializesetDataWithManyArgsResult(result);
}

export function setDataWithManyStructuredArgsWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesetDataWithManyStructuredArgsArgs(argsBuf);
  const result = setDataWithManyStructuredArgs({
    address: args.address,
    valueA: args.valueA,
    valueB: args.valueB,
    valueC: args.valueC,
    valueD: args.valueD,
    valueE: args.valueE,
    valueF: args.valueF,
    valueG: args.valueG,
    valueH: args.valueH,
    valueI: args.valueI,
    valueJ: args.valueJ,
    valueK: args.valueK,
    valueL: args.valueL,
    connection: args.connection
  });
  return serializesetDataWithManyStructuredArgsResult(result);
}

export function deployContractWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializedeployContractArgs(argsBuf);
  const result = deployContract({
    connection: args.connection
  });
  return serializedeployContractResult(result);
}

export function localVarMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializelocalVarMethodArgs(argsBuf);
  const result = localVarMethod({
    address: args.address,
    connection: args.connection
  });
  return serializelocalVarMethodResult(result);
}

export function globalVarMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeglobalVarMethodArgs(argsBuf);
  const result = globalVarMethod({
    address: args.address,
    connection: args.connection
  });
  return serializeglobalVarMethodResult(result);
}

export function subsequentInvokesWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesubsequentInvokesArgs(argsBuf);
  const result = subsequentInvokes({
    address: args.address,
    numberOfTimes: args.numberOfTimes,
    connection: args.connection
  });
  return serializesubsequentInvokesResult(result);
}
