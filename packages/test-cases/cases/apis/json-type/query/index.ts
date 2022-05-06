import {
  Input_parse,
  Input_stringify,
  Pair
} from "./w3";
import { Json, JSON } from "@web3api/wasm-as";

export function parse(input: Input_parse): Pair {
  return JSON.parse<Pair>(input.str);
}

export function stringify(input: Input_stringify): Json {
  return JSON.stringify(input.pair);
}
