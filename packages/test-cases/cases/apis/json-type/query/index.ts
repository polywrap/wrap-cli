import {
  Input_parse,
  Input_stringify,
  Input_stringifyObject,
  Input_methodJSON
} from "./w3";
import { JSON } from "@web3api/wasm-as";

export function parse(input: Input_parse): JSON.Value {
  return JSON.parse(input.value);
}

export function stringify(input: Input_stringify): string {
  let str = "";
  for (let i = 0; i < input.values.length; ++i) {
    const value = input.values[i];
    str += value.stringify();
  }
  return str;
}

export function stringifyObject(input: Input_stringifyObject): string {
  let str = "";
  str += input.object.jsonA.stringify();
  str += input.object.jsonB.stringify();
  return str;
}

export function methodJSON(input: Input_methodJSON): JSON.Value {
  const result = JSON.Value.Object();
  result.set("valueA", JSON.from(input.valueA));
  result.set("valueB", JSON.from(input.valueB));
  result.set("valueC", JSON.from(input.valueC));

  return result;
}
