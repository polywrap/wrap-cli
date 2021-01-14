import {
  W3Exports,
  W3Imports,
  HostDispatcher,
  u32,
  HostAction
} from "./types";
import {
  readBytes,
  readString,
  writeBytes,
  writeString
} from "./utils";
import { maxThreads } from "./WasmWeb3Api";

import { Observable, SubscriptionObserver } from "observable-fns";
import { expose } from "threads";
import { encode } from "@msgpack/msgpack";

interface State {
  method?: string;
  args?: ArrayBuffer;
  invoke: {
    result?: ArrayBuffer;
    error?: string;
  };
  subinvoke: {
    result?: ArrayBuffer;
    error?: string;
  };
  threadMutexes?: Int32Array;
  threadId?: number;
}

const state: State = {
  invoke: { },
  subinvoke: { },
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
    __w3_subinvoke: (
      uriPtr: u32, uriLen: u32,
      modulePtr: u32, moduleLen: u32,
      methodPtr: u32, methodLen: u32,
      inputPtr: u32, inputLen: u32
    ): boolean => {
      if (state.threadId === undefined || state.threadMutexes === undefined) {
        abort(
          observer,
          `__w3_subinvoke: thread uninitialized.\nthreadId: ${state.threadId}\nthreadMutexes: ${state.threadMutexes}`
        );
        return false;
      }

      const uri = readString(memory.buffer, uriPtr, uriLen);
      const module = readString(memory.buffer, modulePtr, moduleLen);
      const method = readString(memory.buffer, methodPtr, methodLen);
      const input = readBytes(memory.buffer, inputPtr, inputLen);

      observer.next({
        type: "SubInvoke",
        uri,
        module,
        method,
        input
      });

      // Pause the thread
      while (!state.subinvoke.error && !state.subinvoke.result) {
        Atomics.wait(
          state.threadMutexes,
          state.threadId,
          0,
          500
        );
      }

      // Reset our lock to 0
      Atomics.store(
        new Int32Array(state.threadMutexes),
        state.threadId,
        0
      );

      return !state.subinvoke.error;
    },
    // Give WASM the size of the result
    __w3_subinvoke_result_len: (): u32 => {
      if (!state.subinvoke.result) {
        abort(observer, "__w3_subinvoke_result_len: subinvoke.result is not set");
        return 0;
      }
      return state.subinvoke.result.byteLength;
    },
    // Copy the subinvoke result into WASM
    __w3_subinvoke_result: (ptr: u32): void => {
      if (!state.subinvoke.result) {
        abort(observer, "__w3_subinvoke_result: subinvoke.result is not set");
        return;
      }
      writeBytes(state.subinvoke.result, memory.buffer, ptr);
    },
    // Give WASM the size of the error
    __w3_subinvoke_error_len: (): u32 => {
      if (!state.subinvoke.error) {
        abort(observer, "__w3_subinvoke_error_len: subinvoke.error is not set");
        return 0;
      }
      return state.subinvoke.error.length;
    },
    // Copy the subinvoke error into WASM
    __w3_subinvoke_error: (ptr: u32): void => {
      if (!state.subinvoke.error) {
        abort(observer, "__w3_subinvoke_error: subinvoke.error is not set");
        return;
      }
      writeString(state.subinvoke.error, memory.buffer, ptr);
    },
    // Copy the invocation's method & args into WASM
    __w3_invoke_args: (methodPtr: u32, argsPtr: u32): void => {
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
    __w3_invoke_result: (ptr: u32, len: u32): void => {
      state.invoke.result = readBytes(memory.buffer, ptr, len);
    },
    // Store the invocation's error
    __w3_invoke_error: (ptr: u32, len: u32): void => {
      state.invoke.error = readString(memory.buffer, ptr, len);
    }
  },
  env: {
    memory,
    abort: (msg: string, file: string, line: number, column: number) => {
      abort(observer, `WASM Abort: ${msg}\nFile: ${file}\n[${line},${column}]`);
      return;
    }
  }
});

const methods = {
  start: (
    wasm: ArrayBuffer,
    method: string,
    input: Record<string, unknown> | ArrayBuffer,
    threadMutexesBuffer: SharedArrayBuffer,
    threadId: number
  ): HostDispatcher => new Observable(observer => {

    // Store thread mutexes & ID, used for pausing the thread's execution
    state.threadMutexes = new Int32Array(threadMutexesBuffer, 0, maxThreads);
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
  subInvokeResult: (result: unknown | ArrayBuffer) => {
    if (result instanceof ArrayBuffer) {
      state.subinvoke.result = result;
    } else {
      // We must serialize the result object into msgpack
      state.subinvoke.result = encode(result);
    }
  },
  subInvokeError: (error: string): void => {
    state.subinvoke.error = error;
  }
};

export type ThreadMethods = typeof methods;

expose(methods as Record<string, any>);
