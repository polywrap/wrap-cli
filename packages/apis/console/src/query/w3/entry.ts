import {
  w3_add_invoke,
  w3_invoke,
  w3_abort
} from "@web3api/wasm-as";
import {
  debugWrapped,
  infoWrapped,
  warnWrapped,
  errorWrapped
} from "./Query/wrapped";

export function _w3_init(): void {
  w3_add_invoke("debug", debugWrapped);
  w3_add_invoke("info", infoWrapped);
  w3_add_invoke("warn", warnWrapped);
  w3_add_invoke("error", errorWrapped);
}

export function _w3_invoke(method_size: u32, args_size: u32): bool {
  return w3_invoke(method_size, args_size);
}

export function w3Abort(
  msg: string | null,
  file: string | null,
  line: u32,
  column: u32
): void {
  w3_abort(
    msg ? msg : "",
    file ? file : "",
    line,
    column
  );
}
