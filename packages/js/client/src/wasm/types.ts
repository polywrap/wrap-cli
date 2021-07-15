/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */

export type u32 = number;

export interface W3Exports {
  // Needed to comply with WebAssembly's typings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;

  asyncify_start_unwind: (dataAddr: number) => void;
  asyncify_stop_unwind: () => void;
  asyncify_start_rewind: (dataAddr: number) => void;
  asyncify_stop_rewind: () => void;

  _w3_init: () => void;
  _w3_invoke: (nameLen: u32, argsLen: u32) => boolean;
}

export interface W3Imports {
  // Needed to comply with WebAssembly's typings
  [key: string]: Record<string, Function | WebAssembly.Memory>;

  w3: {
    __w3_subinvoke: (
      uriPtr: u32,
      uriLen: u32,
      modulePtr: u32,
      moduleLen: u32,
      methodPtr: u32,
      methodLen: u32,
      inputPtr: u32,
      inputLen: u32
    ) => Promise<boolean>;
    __w3_log: (msgPtr: u32, msgLen: u32) => void;
    __w3_subinvoke_result_len: () => u32;
    __w3_subinvoke_result: (ptr: u32) => void;
    __w3_subinvoke_error_len: () => u32;
    __w3_subinvoke_error: (ptr: u32) => void;
    __w3_invoke_args: (methodPtr: u32, argsPtr: u32) => void;
    __w3_invoke_result: (ptr: u32, len: u32) => void;
    __w3_invoke_error: (ptr: u32, len: u32) => void;
    __w3_abort: (
      msgPtr: u32,
      msgLen: u32,
      filePtr: u32,
      fileLen: u32,
      line: u32,
      column: u32
    ) => void;
  };

  env: {
    memory: WebAssembly.Memory;
  };
}
