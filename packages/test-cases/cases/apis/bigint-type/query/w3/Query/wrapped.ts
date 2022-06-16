import {
  method
} from "../../index";
import {
  deserializemethodArgs,
  serializemethodResult
} from "./serialization";

export function methodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemethodArgs(argsBuf);
  const result = method({
    arg1: args.arg1,
    arg2: args.arg2,
    obj: args.obj
  });
  return serializemethodResult(result);
}
