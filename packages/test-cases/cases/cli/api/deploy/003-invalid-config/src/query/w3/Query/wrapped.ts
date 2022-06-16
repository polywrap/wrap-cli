import {
  get
} from "../../index";
import {
  deserializegetArgs,
  serializegetResult
} from "./serialization";

export function getWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const result = get();
  return serializegetResult(result);
}
