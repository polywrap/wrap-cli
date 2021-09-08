import {
  Input_parse,
  Input_methodString,
  Input_methodJSON
} from "./w3";
import { JSON } from "@web3api/wasm-as";

export function parse(input: Input_parse): JSON.Value {
  return JSON.parse(input.value);
}

export function stringify(input: Input_methodString): string {
  return input.value.stringify();
}

export function methodJSON(input: Input_methodJSON): JSON.Value {
  const result = JSON.Value.Object();
  result.set("valueA", JSON.from(input.valueA));
  result.set("valueB", JSON.from(input.valueB));
  result.set("valueC", JSON.from(input.valueC));

  return result;
}
