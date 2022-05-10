import {
  Input_fromJson,
  Input_toJson,
  Pair
} from "./w3";
import { JSON } from "@web3api/wasm-as";

export function fromJson(input: Input_fromJson): Pair {
  return Pair.fromJson(input.json);
}

export function toJson(input: Input_toJson): JSON.Value {
  return Pair.toJson(input.pair);
}
