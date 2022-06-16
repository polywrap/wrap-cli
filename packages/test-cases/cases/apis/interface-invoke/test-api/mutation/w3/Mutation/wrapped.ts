import {
  mutationMethod
} from "../../index";
import {
  deserializemutationMethodArgs,
  serializemutationMethodResult
} from "./serialization";

export function mutationMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemutationMethodArgs(argsBuf);
  const result = mutationMethod({
    arg: args.arg
  });
  return serializemutationMethodResult(result);
}
