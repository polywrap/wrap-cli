import {
  mutationMethod,
  abstractMutationMethod
} from "../../index";
import {
  deserializemutationMethodArgs,
  serializemutationMethodResult,
  deserializeabstractMutationMethodArgs,
  serializeabstractMutationMethodResult
} from "./serialization";

export function mutationMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemutationMethodArgs(argsBuf);
  const result = mutationMethod({
    arg: args.arg
  });
  return serializemutationMethodResult(result);
}

export function abstractMutationMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeabstractMutationMethodArgs(argsBuf);
  const result = abstractMutationMethod({
    arg: args.arg
  });
  return serializeabstractMutationMethodResult(result);
}
