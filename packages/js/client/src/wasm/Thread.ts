import {
  W3Exports,
  W3Imports,
  HostDispatcher,
  ThreadMethods,
  usize
} from "./types";

import { expose } from "threads/worker";
import { encode } from "@msgpack/msgpack";

const imports = (hostDispatch: HostDispatcher): W3Imports => ({
  w3: {
    __w3_subquery: (
      uriPtr: usize, uriLen: usize,
      queryPtr: usize, queryLen: usize,
      argsPtr: usize, argsLen: usize
    ): boolean => {
      // TODO: read uri, query, and args. Then send the subquery and
      //       only return when its' finished
      // Args: uri_ptr: i32, uri_len: usize, query_ptr/len, args_ptr/len
      // Ret: bool
      // TODO:
      // observable.next({ type: "__w3_subquery", data: { uri, query, args } });
      // Atomics.wait(threadId, 1);
      // wait for w3_subquery_result to have finished
      return true;
    },
    __w3_subquery_result_len: (): usize => {
      // TODO: return size of result buffer
      // Ret: usize
      return 0;
    },
    __w3_subquery_result: (ptr: usize): void => {
      // TODO: fill the wasm buffer with the result buffer
      // Args: ptr: i32
    },
    __w3_subquery_error_len: (): usize => {
      // TODO: return size of error buffer
      // Ret: usize
      return 0;
    },
    __w3_subquery_error: (ptr: usize): void => {
      // TODO: fill the wasm buffer with the error
      // Arg: ptr: i32
    },
    __w3_invoke_args: (namePtr: usize, argsPtr: usize): void => {
      // TODO: fill the wasm name + args buffer with method + input
      // Arg: name_ptr: i32, args_ptr: i32
    },
    __w3_invoke_result: (ptr: usize, len: usize): void => {
      // TODO: store the invoke result
      // Arg: name_ptr: i32, len: usize
    },
    __w3_invoke_error: (ptr: usize, len: usize): void => {
      // TODO: store the invoke error
      // // Arg: ptr: i32, len: usize
    }
  }
})

const methods: ThreadMethods = {
  start: (
    wasm: ArrayBuffer,
    method: string,
    input: Record<string, unknown> | ArrayBuffer
  ): HostDispatcher => {

    let msgpack: ArrayBuffer;

    if (input instanceof ArrayBuffer) {
      // No need to serialize
      msgpack = input;
    } else {
      // We must serialize the input object into msgpack
      msgpack = encode(input);
    }

    const module = new WebAssembly.Module(wasm);
    const source = new WebAssembly.Instance(module, );

    const exports = source.exports as W3Exports;

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
  },
  subQueryResult: (result: ArrayBuffer) => {
    // TODO:
    // serialize & set result (transferable)
    // set flag
  },
  subQueryError: (error: string): void => {
    // TODO:
    // serialize & store error
    // set flag
  }
}

expose(methods as Record<string, any>);
