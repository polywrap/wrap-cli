import {
  Input_fromJson,
  Input_toJson,
  Pair
} from "./wrap";
import { JSON } from "@polywrap/wasm-as";

export function fromJson(input: Input_fromJson): Pair {
  return Pair.fromJson(input.json);
}

export function toJson(input: Input_toJson): JSON.Value {
  return Pair.toJson(input.pair);
}
