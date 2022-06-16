import {
  getKey,
  returnMap
} from "../../index";
import {
  deserializegetKeyArgs,
  serializegetKeyResult,
  deserializereturnMapArgs,
  serializereturnMapResult
} from "./serialization";

export function getKeyWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializegetKeyArgs(argsBuf);
  const result = getKey({
    key: args.key,
    map: args.map
  });
  return serializegetKeyResult(result);
}

export function returnMapWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializereturnMapArgs(argsBuf);
  const result = returnMap({
    map: args.map
  });
  return serializereturnMapResult(result);
}
