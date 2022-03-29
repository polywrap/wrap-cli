import {
  queryMethod,
  objectMethod
} from "../../index";
import {
  deserializequeryMethodArgs,
  serializequeryMethodResult,
  Input_queryMethod,
  deserializeobjectMethodArgs,
  serializeobjectMethodResult,
  Input_objectMethod
} from "./serialization";

export function queryMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializequeryMethodArgs(argsBuf);
  const input = new Input_queryMethod(
    args.str,
    args.optStr,
    args.en,
    args.optEnum,
    args.enumArray,
    args.optEnumArray,
    args.map
  );
  const result = queryMethod(input);
  return serializequeryMethodResult(result);
}

export function objectMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeobjectMethodArgs(argsBuf);
  const input = new Input_objectMethod(
    args.object,
    args.optObject,
    args.objectArray,
    args.optObjectArray
  );
  const result = objectMethod(input);
  return serializeobjectMethodResult(result);
}
