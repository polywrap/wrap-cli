import {
  Input_parse,
  Input_stringify,
  Pair
} from "./w3";
import { JSON } from "@web3api/wasm-as";

export function parse(input: Input_parse): Pair {
  return JSON.parse<Pair>(input.str);
}

export function stringify(input: Input_stringify): string {
  return JSON.stringify(input.pair);
}
