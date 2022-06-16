import {
  method1,
  method2,
  method3,
  method5
} from "../../index";
import {
  deserializemethod1Args,
  serializemethod1Result,
  deserializemethod2Args,
  serializemethod2Result,
  deserializemethod3Args,
  serializemethod3Result,
  deserializemethod5Args,
  serializemethod5Result
} from "./serialization";

export function method1Wrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemethod1Args(argsBuf);
  const result = method1({
    arg1: args.arg1,
    arg2: args.arg2
  });
  return serializemethod1Result(result);
}

export function method2Wrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemethod2Args(argsBuf);
  const result = method2({
    arg: args.arg
  });
  return serializemethod2Result(result);
}

export function method3Wrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemethod3Args(argsBuf);
  const result = method3({
    arg: args.arg
  });
  return serializemethod3Result(result);
}

export function method5Wrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemethod5Args(argsBuf);
  const result = method5({
    arg: args.arg
  });
  return serializemethod5Result(result);
}
