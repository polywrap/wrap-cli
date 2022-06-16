import {
  getData,
  tryGetData,
  throwGetData
} from "../../index";
import {
  deserializegetDataArgs,
  serializegetDataResult,
  deserializetryGetDataArgs,
  serializetryGetDataResult,
  deserializethrowGetDataArgs,
  serializethrowGetDataResult
} from "./serialization";

export function getDataWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializegetDataArgs(argsBuf);
  const result = getData({
    address: args.address,
    connection: args.connection
  });
  return serializegetDataResult(result);
}

export function tryGetDataWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializetryGetDataArgs(argsBuf);
  const result = tryGetData({
    address: args.address,
    connection: args.connection
  });
  return serializetryGetDataResult(result);
}

export function throwGetDataWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializethrowGetDataArgs(argsBuf);
  const result = throwGetData({
    address: args.address,
    connection: args.connection
  });
  return serializethrowGetDataResult(result);
}
