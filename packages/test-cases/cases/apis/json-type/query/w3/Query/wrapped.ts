import {
  fromJson,
  toJson
} from "../../index";
import {
  deserializefromJsonArgs,
  serializefromJsonResult,
  deserializetoJsonArgs,
  serializetoJsonResult
} from "./serialization";

export function fromJsonWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializefromJsonArgs(argsBuf);
  const result = fromJson({
    json: args.json
  });
  return serializefromJsonResult(result);
}

export function toJsonWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializetoJsonArgs(argsBuf);
  const result = toJson({
    pair: args.pair
  });
  return serializetoJsonResult(result);
}
