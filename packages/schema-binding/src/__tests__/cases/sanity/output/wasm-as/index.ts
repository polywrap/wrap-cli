import {
  w3_add_call,
  w3_call
} from "@web3api/wasm-as";
import {
  queryMethodWrapped
} from "./Query";

export function _w3_init(): void {
  w3_add_call("queryMethod", queryMethodWrapped);
}

export function _w3_call(name_size: usize, args_size: usize): bool {
  return w3_call(name_size, args_size);
}
