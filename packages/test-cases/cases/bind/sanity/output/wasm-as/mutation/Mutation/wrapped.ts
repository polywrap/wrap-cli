import {
  mutationMethod,
  objectMethod
} from "../../index";
import {
  deserializemutationMethodArgs,
  serializemutationMethodResult,
  deserializeobjectMethodArgs,
  serializeobjectMethodResult
} from "./serialization";

export function mutationMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemutationMethodArgs(argsBuf);
  const result = mutationMethod({
    str: args.str,
    optStr: args.optStr,
    en: args.en,
    optEnum: args.optEnum,
    enumArray: args.enumArray,
    optEnumArray: args.optEnumArray
  });
  return serializemutationMethodResult(result);
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
