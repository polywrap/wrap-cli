import {
  queryMethod,
  abstractQueryMethod
} from "../../index";
import {
  deserializequeryMethodArgs,
  serializequeryMethodResult,
  deserializeabstractQueryMethodArgs,
  serializeabstractQueryMethodResult
} from "./serialization";

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
