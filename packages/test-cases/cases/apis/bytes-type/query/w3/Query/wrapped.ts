import {
  bytesMethod
} from "../../index";
import {
  deserializebytesMethodArgs,
  serializebytesMethodResult
} from "./serialization";

export function bytesMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializebytesMethodArgs(argsBuf);
  const result = bytesMethod({
    arg: args.arg
  });
  return serializebytesMethodResult(result);
}
