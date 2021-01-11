import { expose } from "threads/worker";
import { encode } from "@msgpack/msgpack";

export interface ThreadState {

}

const state: ThreadState = {

}

interface Web3ApiExports {
  _w3_init: () => void;
}

const methods = {
  start: (
    wasm: ArrayBuffer,
    method: string,
    input: Record<string, unknown> | ArrayBuffer
  ): ThreadState => {

    let msgpack: ArrayBuffer;

    if (input instanceof ArrayBuffer) {
      // No need to serialize
      msgpack = input;
    } else {
      // We must serialize the input object into msgpack
      msgpack = encode(input);
    }

    const module = new WebAssembly.Module(wasm);
    const source = new WebAssembly.Instance(module, {
      w3: {
        __w3_query: () => {
          // TODO: read uri, query, and args. Then send the subquery and
          //       only return when its' finished
          // Args: uri_ptr: i32, uri_len: usize, query_ptr/len, args_ptr/len
          // Ret: bool
        },
        __w3_query_result_len: () => {
          // TODO: return size of result buffer
          // Ret: usize
        },
        __w3_query_result: () => {
          // TODO: fill the wasm buffer with the result buffer
          // Args: ptr: i32
        },
        __w3_query_error_len: () => {
          // TODO: return size of error buffer
          // Ret: usize
        },
        __w3_query_error: () => {
          // TODO: fill the wasm buffer with the error
          // Arg: ptr: i32
        },
        __w3_invoke_args: () => {
          // TODO: fill the wasm name + args buffer with method + input
          // Arg: name_ptr: i32, args_ptr: i32
        },
        __w3_invoke_result: () => {
          // TODO: store the invoke result
          // Arg: name_ptr: i32, len: usize
        },
        __w3_invoke_error: () => {
          // TODO: store the invoke error
          // // Arg: ptr: i32, len: usize
        }
      }
    });

    const exports = source.exports as Web3ApiExports;

    if (!exports._w3_init) {
      // TODO: Throw an error
    }

    exports._w3_init();

    // _w3_init(): void
    // _w3_invoke(name_size: usize, args_size: usize): bool

    // TODO:
    // - instantiate wasm module
    // - call method w/ imports

    return { };
  }
}

export type ThreadMethods = typeof methods;

expose(methods);
