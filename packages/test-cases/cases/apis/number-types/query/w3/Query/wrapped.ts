import {
  i8Method,
  u8Method,
  i16Method,
  u16Method,
  i32Method,
  u32Method
} from "../../index";
import {
  deserializei8MethodArgs,
  serializei8MethodResult,
  deserializeu8MethodArgs,
  serializeu8MethodResult,
  deserializei16MethodArgs,
  serializei16MethodResult,
  deserializeu16MethodArgs,
  serializeu16MethodResult,
  deserializei32MethodArgs,
  serializei32MethodResult,
  deserializeu32MethodArgs,
  serializeu32MethodResult
} from "./serialization";

export function i8MethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializei8MethodArgs(argsBuf);
  const result = i8Method({
    first: args.first,
    second: args.second
  });
  return serializei8MethodResult(result);
}

export function u8MethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeu8MethodArgs(argsBuf);
  const result = u8Method({
    first: args.first,
    second: args.second
  });
  return serializeu8MethodResult(result);
}

export function i16MethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializei16MethodArgs(argsBuf);
  const result = i16Method({
    first: args.first,
    second: args.second
  });
  return serializei16MethodResult(result);
}

export function u16MethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeu16MethodArgs(argsBuf);
  const result = u16Method({
    first: args.first,
    second: args.second
  });
  return serializeu16MethodResult(result);
}

export function i32MethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializei32MethodArgs(argsBuf);
  const result = i32Method({
    first: args.first,
    second: args.second
  });
  return serializei32MethodResult(result);
}

export function u32MethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeu32MethodArgs(argsBuf);
  const result = u32Method({
    first: args.first,
    second: args.second
  });
  return serializeu32MethodResult(result);
}
