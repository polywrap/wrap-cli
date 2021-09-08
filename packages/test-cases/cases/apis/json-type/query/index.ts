import { Input_parse, Input_methodString, Input_methodJSON } from "./w3";
import { JSON as ASJSON } from "@web3api/wasm-as";

export function parse(input: Input_parse): ASJSON.Obj {
  return <ASJSON.Obj>ASJSON.parse(input.value);
}

export function methodString(input: Input_methodString): string {
  const result = ASJSON.Value.Object();
  result.set("valueA", ASJSON.from(input.valueA));
  result.set("valueB", ASJSON.from(input.valueB));
  result.set("valueC", ASJSON.from(input.valueC));

  return result.stringify();
}

export function methodJSON(input: Input_methodJSON): ASJSON.Obj {
  const result = ASJSON.Value.Object();
  result.set("valueA", ASJSON.from(input.valueA));
  result.set("valueB", ASJSON.from(input.valueB));
  result.set("valueC", ASJSON.from(input.valueC));

  return result;
}
