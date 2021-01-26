import {
  w3_add_invoke,
  w3_invoke
} from "@web3api/wasm-as";
import {
  queryMethodWrapped
} from "./Query/wrapped";

export function _w3_init(): void {
  w3_add_invoke("queryMethod", queryMethodWrapped);
}

export function _w3_invoke(method_size: u32, args_size: u32): bool {
  return w3_invoke(method_size, args_size);
}
