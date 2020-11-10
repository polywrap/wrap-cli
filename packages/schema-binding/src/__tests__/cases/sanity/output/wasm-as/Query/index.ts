import {
  queryMethod
} from "../../";
import {
  deserializequeryMethodArgs,
  serializequeryMethodResult
} from "./serialization";

export function queryMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializequeryMethodArgs(argsBuf);
  const result = queryMethod(
    args.arg
  );
  return serializequeryMethodResult(result);
}
