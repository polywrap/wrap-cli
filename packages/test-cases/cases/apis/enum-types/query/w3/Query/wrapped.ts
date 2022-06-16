import {
  method1,
  method2
} from "../../index";
import {
  deserializemethod1Args,
  serializemethod1Result,
  deserializemethod2Args,
  serializemethod2Result
} from "./serialization";

export function method1Wrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemethod1Args(argsBuf);
  const result = method1({
    en: args.en,
    optEnum: args.optEnum
  });
  return serializemethod1Result(result);
}

export function method2Wrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemethod2Args(argsBuf);
  const result = method2({
    enumArray: args.enumArray,
    optEnumArray: args.optEnumArray
  });
  return serializemethod2Result(result);
}
