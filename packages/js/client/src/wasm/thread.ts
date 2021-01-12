import {
  W3Exports,
  W3Imports,
  HostDispatcher,
  usize,
  HostAction
} from "./types";
import { memcpy } from "./utils";

import { Observable, SubscriptionObserver } from "observable-fns";
import { expose } from "threads/worker";
import { encode } from "@msgpack/msgpack";

interface State {
  method?: string;
  args?: ArrayBuffer;
  invoke: {
    result?: ArrayBuffer;
    error?: string;
  };
  subquery: {
    result?: ArrayBuffer;
    error?: string;
  };
}

const state: State = {
  invoke: { },
  subquery: { }
}

const imports = (
  hostDispatch: SubscriptionObserver<HostAction>,
  memory: WebAssembly.Memory
): W3Imports => ({
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
      // TODO: error reporting
      return state.subquery.result.byteLength;
    },
    __w3_subquery_result: (ptr: usize): void => {
      // TODO: fill the wasm buffer with the result buffer
      write(memory, ptr, state.subquery.result);
    },
    __w3_subquery_error_len: (): usize => {
      // TODO: return size of error buffer
      // TODO: error reporting
      return state.subquery.error.length;
    },
    __w3_subquery_error: (ptr: usize): void => {
      // TODO: test this
      const heap = new Uint8Array(memory.buffer);
      const encode = new TextEncoder();
      const error = encode.encode(state.subquery.error);
      memcpy(error, 0, heap, ptr, error.length);
    },
    __w3_invoke_args: (methodPtr: usize, argsPtr: usize): void => {
      // TODO: fill the wasm name + args buffer with method + input
      write(memory, methodPtr, state.method);
      write(memory, argsPtr, state.args);
    },
    __w3_invoke_result: (ptr: usize, len: usize): void => {
      // TODO: store the invoke result
      state.invoke.result = read(memory, ptr, len);
    },
    __w3_invoke_error: (ptr: usize, len: usize): void => {
      // TODO: store the invoke error
      state.invoke.error = read(memory, ptr, len);
    }
  },
  env: {
    memory
  }
});

const methods = {
  start: (
    wasm: ArrayBuffer,
    method: string,
    input: Record<string, unknown> | ArrayBuffer
  ): HostDispatcher => new Observable(observer => {

    const abort = (message: string) => {
      observer.next({
        type: "Abort",
        message
      });
      observer.complete();
    }

    // Store the method we're invoking
    state.method = method;

    if (input instanceof ArrayBuffer) {
      // No need to serialize
      state.args = input;
    } else {
      // We must serialize the input object into msgpack
      state.args = encode(input);
    }

    const module = new WebAssembly.Module(wasm);
    const memory = new WebAssembly.Memory({ initial: 1 });
    const source = new WebAssembly.Instance(
      module, imports(observer, memory)
    );

    const exports = source.exports as W3Exports;

    const hasExport = (name: string, exports: Record<string, unknown>): boolean => {
      if (!exports[name]) {
        abort(`A required export was not found: ${name}`);
        return false;
      }

      return true;
    }

    // Make sure _w3_init exists
    if (!hasExport("_w3_init", exports)) {
      return;
    }

    // Initialize the Web3Api module
    exports._w3_init();

    // Make sure _w3_invoke exists
    if (!hasExport("_w3_invoke", exports)) {
      return;
    }

    const result = exports._w3_invoke(
      state.method.length,
      state.args.byteLength
    );

    if (!result) {
      if (!state.invoke.result) {
        abort(`Invoke result is missing.`);
        return;
      }

      // __w3_invoke_result has already been called
      observer.next({
        type: "LogQueryResult",
        result: state.invoke.result
      });
    } else {
      if (!state.invoke.error) {
        abort(`Invoke error is missing.`);
        return;
      }

      // __w3_invoke_error has already been called
      observer.next({
        type: "LogQueryError",
        error: state.invoke.error
      });
    }

    observer.complete();
  }),
  subQueryResult: (result: Record<string, unknown> | ArrayBuffer) => {
    if (result instanceof ArrayBuffer) {
      state.subquery.result = result;
    } else {
      // We must serialize the result object into msgpack
      state.subquery.result = encode(result);
    }
  },
  subQueryError: (error: string): void => {
    state.subquery.error = error;
  }
};

export type ThreadMethods = typeof methods;

expose(methods as Record<string, any>);
