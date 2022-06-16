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
    arg: args.arg
  });
  return serializemethodResult(result);
}
