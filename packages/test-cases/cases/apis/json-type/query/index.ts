import {
  Input_method
} from "./w3";
import { BigInt, JSON } from "@web3api/wasm-as";

export function stringifyMethod(input: Input_stringifyMethod): String {
  let result = input.arg1.mul(input.obj.prop1);

  if (input.arg2) {
    result = result.mul(input.arg2 as BigInt);
  }
  if (input.obj.prop2) {
    result = result.mul(input.obj.prop2 as BigInt);
  }

  return result;
}

export function parseMethod(input: Input_parseMethod): JSON {
  
}
