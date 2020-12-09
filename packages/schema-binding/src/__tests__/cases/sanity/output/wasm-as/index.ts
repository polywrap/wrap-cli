import {
  w3_add_invoke,
  w3_invoke
} from "@web3api/wasm-as";
import {
  queryMethodWrapped
} from "./Query";

export function _w3_init(): void {
  w3_add_invoke("queryMethod", queryMethodWrapped);
}

export function _w3_invoke(name_size: usize, args_size: usize): bool {
  return w3_invoke(name_size, args_size);
}
