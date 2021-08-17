import { Input_stringify, Input_parse } from "./w3";
import { JSON } from "@web3api/wasm-as";

export function stringify(input: Input_stringify): string {
  return input.value.stringify();
}

export function parse(input: Input_parse): JSON.Obj {
  return <JSON.Obj>JSON.parse(input.value);
}

export function methodString(input: Input_methodString): string {
  const result = JSON.Value.Object();
  result.set("valueA", JSON.from(input.valueA));
  result.set("valueB", JSON.from(input.valueA));
  result.set("valueC", JSON.from(input.valueA));

  return result.stringify();
}

export function methodJSON(input: Input_methodJSON): JSON.Obj {
  const result = JSON.Value.Object();
  result.set("valueA", JSON.from(input.valueA));
  result.set("valueB", JSON.from(input.valueA));
  result.set("valueC", JSON.from(input.valueA));

  return result;
}
