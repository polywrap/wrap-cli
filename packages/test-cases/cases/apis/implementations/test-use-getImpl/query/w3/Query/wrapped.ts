import {
  queryImplementations,
  queryMethod,
  abstractQueryMethod
} from "../../index";
import {
  deserializequeryImplementationsArgs,
  serializequeryImplementationsResult,
  deserializequeryMethodArgs,
  serializequeryMethodResult,
  deserializeabstractQueryMethodArgs,
  serializeabstractQueryMethodResult
} from "./serialization";

export function queryImplementationsWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const result = queryImplementations();
  return serializequeryImplementationsResult(result);
}

export function queryMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializequeryMethodArgs(argsBuf);
  const result = queryMethod({
    arg: args.arg
  });
  return serializequeryMethodResult(result);
}

export function abstractQueryMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeabstractQueryMethodArgs(argsBuf);
  const result = abstractQueryMethod({
    arg: args.arg
  });
  return serializeabstractQueryMethodResult(result);
}
