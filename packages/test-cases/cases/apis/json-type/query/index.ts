import {
  Input_parse,
  Input_stringify,
  Pair
} from "./w3";
import { JSON, decode, encode } from "@web3api/wasm-as";

export function decode(input: Input_parse): Pair {
  return decode<Pair>(input.json);
}

export function encode(input: Input_stringify): JSON.Value {
  return encode(input.pair);
}
