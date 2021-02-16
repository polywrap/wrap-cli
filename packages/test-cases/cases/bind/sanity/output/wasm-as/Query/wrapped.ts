import {
  queryMethod,
  objectMethod
} from "../../index";
import {
  deserializequeryMethodArgs,
  serializequeryMethodResult,
  deserializeobjectMethodArgs,
  serializeobjectMethodResult
} from "./serialization";

export function queryMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializequeryMethodArgs(argsBuf);
  const result = queryMethod({
    arg: args.arg
  });
  return serializequeryMethodResult(result);
}

export function objectMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeobjectMethodArgs(argsBuf);
  const result = objectMethod({
    object: args.object,
    optObject: args.optObject,
    objectArray: args.objectArray,
    optObjectArray: args.optObjectArray
  });
  return serializeobjectMethodResult(result);
}
