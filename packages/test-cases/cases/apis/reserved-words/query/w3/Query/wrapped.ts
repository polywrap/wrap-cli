import {
  method1
} from "../../index";
import {
  deserializemethod1Args,
  serializemethod1Result
} from "./serialization";

export function method1Wrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemethod1Args(argsBuf);
  const result = method1({
    m_const: args.m_const
  });
  return serializemethod1Result(result);
}
