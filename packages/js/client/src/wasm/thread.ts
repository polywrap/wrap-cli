import {
  W3Exports,
  W3Imports,
  HostDispatcher,
  usize,
  HostAction
} from "./types";
import {
  readBytes,
  readString,
  writeBytes,
  writeString
} from "./utils";

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
  threadMutexes?: SharedArrayBuffer;
  threadId?: number;
}

const state: State = {
  invoke: { },
  subquery: { },
}

const abort = (
  observer: SubscriptionObserver<HostAction>,
  message: string
) => {
  observer.next({
    type: "Abort",
    message
  });
  observer.complete();
}

const imports = (
  observer: SubscriptionObserver<HostAction>,
  memory: WebAssembly.Memory
): W3Imports => ({
  w3: {
    __w3_subquery: (
      uriPtr: usize, uriLen: usize,
      queryPtr: usize, queryLen: usize,
      argsPtr: usize, argsLen: usize
    ): boolean => {
      const uri = readString(memory.buffer, uriPtr, uriLen);
      const query = readString(memory.buffer, queryPtr, queryLen);
      const args = readBytes(memory.buffer, argsPtr, argsLen);

      observer.next({
        type: "SubQuery",
        uri,
        query,
        args
      });

      if (!state.threadId || !state.threadMutexes) {
        abort(
          observer,
          `__w3_subquery: thread unitialized.\nthreadId: ${state.threadId}\nthreadMutexes: ${state.threadMutexes}`
        );
        return false;
      }

      // Pause the thread, unpausing every 500ms to enable pending
      // events to be processed.
      // TODO: might not be needed, test this.
      while (!state.subquery.error && !state.subquery.result) {
        Atomics.wait(
          new Int32Array(state.threadMutexes),
          state.threadId,
          1,
          500
        );
      }

      return !state.subquery.error;
    },
    // Give WASM the size of the result
    __w3_subquery_result_len: (): usize => {
      if (!state.subquery.result) {
        abort(observer, "__w3_subquery_result_len: subquery.result is not set");
        return 0;
      }
      return state.subquery.result.byteLength;
    },
    // Copy the subquery result into WASM
    __w3_subquery_result: (ptr: usize): void => {
      if (!state.subquery.result) {
        abort(observer, "__w3_subquery_result: subquery.result is not set");
        return;
      }
      writeBytes(state.subquery.result, memory.buffer, ptr);
    },
    // Give WASM the size of the error
    __w3_subquery_error_len: (): usize => {
      if (!state.subquery.error) {
        abort(observer, "__w3_subquery_error_len: subquery.error is not set");
        return 0;
      }
      return state.subquery.error.length;
    },
    // Copy the subquery error into WASM
    __w3_subquery_error: (ptr: usize): void => {
      if (!state.subquery.error) {
        abort(observer, "__w3_subquery_error: subquery.error is not set");
        return;
      }
      writeString(state.subquery.error, memory.buffer, ptr);
    },
    // Copy the invocation's method & args into WASM
    __w3_invoke_args: (methodPtr: usize, argsPtr: usize): void => {
      if (!state.method) {
        abort(observer, "__w3_invoke_args: method is not set");
        return;
      }
      if (!state.args) {
        abort(observer, "__w3_invoke_args: args is not set");
        return;
      }
      writeString(state.method, memory.buffer, methodPtr);
      writeBytes(state.args, memory.buffer, argsPtr);
    },
    // Store the invocation's result
    __w3_invoke_result: (ptr: usize, len: usize): void => {
      state.invoke.result = readBytes(memory.buffer, ptr, len);
    },
    // Store the invocation's error
    __w3_invoke_error: (ptr: usize, len: usize): void => {
      state.invoke.error = readString(memory.buffer, ptr, len);
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
    input: Record<string, unknown> | ArrayBuffer,
    threadMutexes: SharedArrayBuffer,
    threadId: number
  ): HostDispatcher => new Observable(observer => {

    // Store thread mutexes & ID, used for pausing the thread's execution
    state.threadMutexes = threadMutexes;
    state.threadId = threadId;

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
        abort(observer, `A required export was not found: ${name}`);
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
        abort(observer, `Invoke result is missing.`);
        return;
      }

      // __w3_invoke_result has already been called
      observer.next({
        type: "LogQueryResult",
        result: state.invoke.result
      });
    } else {
      if (!state.invoke.error) {
        abort(observer, `Invoke error is missing.`);
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
