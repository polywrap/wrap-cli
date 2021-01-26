import {
  queryMethod
} from "../../index";
import {
  deserializequeryMethodArgs,
  serializequeryMethodResult
} from "./serialization";

export function queryMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializequeryMethodArgs(argsBuf);
  const result = queryMethod({
    arg: args.arg
  });
  return serializequeryMethodResult(result);
}
