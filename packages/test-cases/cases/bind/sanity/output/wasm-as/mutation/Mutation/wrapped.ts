import {
  mutationMethod,
  objectMethod
} from "../../index";
import {
  deserializemutationMethodArgs,
  serializemutationMethodResult,
  Input_mutationMethod,
  deserializeobjectMethodArgs,
  serializeobjectMethodResult,
  Input_objectMethod
} from "./serialization";

export function mutationMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemutationMethodArgs(argsBuf);
  const input = new Input_mutationMethod(
    args.str,
    args.optStr,
    args.en,
    args.optEnum,
    args.enumArray,
    args.optEnumArray
  );
  const result = mutationMethod(input);
  return serializemutationMethodResult(result);
}

export function objectMethodWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeobjectMethodArgs(argsBuf);
  const input = new Input_objectMethod(
    args.object,
    args.optObject,
    args.objectArray,
    args.optObjectArray
  );
  const result = objectMethod(input);
  return serializeobjectMethodResult(result);
}
