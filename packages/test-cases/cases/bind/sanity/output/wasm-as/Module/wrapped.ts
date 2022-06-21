import {
  moduleMethod,
  objectMethod
} from "../../index";
import {
  deserializemoduleMethodArgs,
  serializemoduleMethodResult,
  deserializeobjectMethodArgs,
  serializeobjectMethodResult
} from "./serialization";

export function moduleMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemoduleMethodArgs(argsBuf);
  const result = moduleMethod({
    str: args.str,
    optStr: args.optStr,
    en: args.en,
    optEnum: args.optEnum,
    enumArray: args.enumArray,
    optEnumArray: args.optEnumArray,
    map: args.map
  });
  return serializemoduleMethodResult(result);
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
