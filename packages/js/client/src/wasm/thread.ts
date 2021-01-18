import {
  W3Exports,
  W3Imports,
  HostAction,
  u32,
  ThreadWakeStatus,
} from "./types";
import { readBytes, readString, writeBytes, writeString } from "./utils";
import { maxThreads, maxTransferBytes } from "./WasmWeb3Api";

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
  transfer?: Uint8Array;
}

const state: State = {
  invoke: {},
  subinvoke: {},
};

const abort = (message: string) => {
  dispatchAction({
    type: "Abort",
    message,
  });
};

const dispatchAction = (action: HostAction) => {
  // @ts-ignore webworker postMessage
  postMessage(action);
};

const imports = (memory: WebAssembly.Memory): W3Imports => ({
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
    ): boolean => {
      if (
        state.threadId === undefined ||
        state.threadMutexes === undefined ||
        state.transfer === undefined
      ) {
        abort(
          `__w3_subinvoke: thread uninitialized.\nthreadId: ${state.threadId}\nthreadMutexes: ${state.threadMutexes}`
        );
        return false;
      }

      // Reset our state
      state.subinvoke.result = undefined;
      state.subinvoke.error = undefined;

      const uri = readString(memory.buffer, uriPtr, uriLen);
      const module = readString(memory.buffer, modulePtr, moduleLen);
      const method = readString(memory.buffer, methodPtr, methodLen);
      const input = readBytes(memory.buffer, inputPtr, inputLen);

      // Reset our thread's status
      Atomics.store(state.threadMutexes, state.threadId, 0);

      dispatchAction({
        type: "SubInvoke",
        uri,
        module,
        method,
        input,
      });

      // Pause the thread
      Atomics.wait(state.threadMutexes, state.threadId, 0);

      // Get the code & reset to 0
      const status: ThreadWakeStatus = Atomics.exchange(
        state.threadMutexes,
        state.threadId,
        0
      );

      if (
        status === ThreadWakeStatus.SUBINVOKE_ERROR ||
        status === ThreadWakeStatus.SUBINVOKE_RESULT
      ) {
        let transferStatus: ThreadWakeStatus = status;
        let numBytes = Atomics.load(state.transfer, 0);
        let data = new Uint8Array(numBytes);
        let progress = 0;

        while (true) {
          const newLength = progress + numBytes;

          if (data.byteLength < newLength) {
            data = new Uint8Array(data, 0, newLength);
          }

          for (let i = 1; i <= numBytes; ++i) {
            data[progress + (i - 1)] = Atomics.load(state.transfer, i);
          }

          progress += numBytes;
          dispatchAction({ type: "TransferComplete" });

          // If the main thread hasn't said we're done yet, wait
          // for another chunk of data
          if (transferStatus !== ThreadWakeStatus.SUBINVOKE_DONE) {
            Atomics.wait(state.threadMutexes, state.threadId, 0);
            transferStatus = Atomics.exchange(
              state.threadMutexes,
              state.threadId,
              0
            );
            numBytes = Atomics.load(state.transfer, 0);
          } else {
            break;
          }
        }

        // Transfer is complete, copy result to desired location
        if (status === ThreadWakeStatus.SUBINVOKE_ERROR) {
          const decoder = new TextDecoder();
          state.subinvoke.error = decoder.decode(data);
          return false;
        } else if (status === ThreadWakeStatus.SUBINVOKE_RESULT) {
          state.subinvoke.result = data.buffer;
          return true;
        }
      } else {
        abort(`__w3_subinvoke: Unknown wake status ${status}`);
        return false;
      }
      return false;
    },
    // Give WASM the size of the result
    __w3_subinvoke_result_len: (): u32 => {
      if (!state.subinvoke.result) {
        abort("__w3_subinvoke_result_len: subinvoke.result is not set");
        return 0;
      }
      return state.subinvoke.result.byteLength;
    },
    // Copy the subinvoke result into WASM
    __w3_subinvoke_result: (ptr: u32): void => {
      if (!state.subinvoke.result) {
        abort("__w3_subinvoke_result: subinvoke.result is not set");
        return;
      }
      writeBytes(state.subinvoke.result, memory.buffer, ptr);
    },
    // Give WASM the size of the error
    __w3_subinvoke_error_len: (): u32 => {
      if (!state.subinvoke.error) {
        abort("__w3_subinvoke_error_len: subinvoke.error is not set");
        return 0;
      }
      return state.subinvoke.error.length;
    },
    // Copy the subinvoke error into WASM
    __w3_subinvoke_error: (ptr: u32): void => {
      if (!state.subinvoke.error) {
        abort("__w3_subinvoke_error: subinvoke.error is not set");
        return;
      }
      writeString(state.subinvoke.error, memory.buffer, ptr);
    },
    // Copy the invocation's method & args into WASM
    __w3_invoke_args: (methodPtr: u32, argsPtr: u32): void => {
      if (!state.method) {
        abort("__w3_invoke_args: method is not set");
        return;
      }
      if (!state.args) {
        abort("__w3_invoke_args: args is not set");
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
    },
  },
  env: {
    memory,
    abort: (msg: string, file: string, line: number, column: number) => {
      abort(`WASM Abort: ${msg}\nFile: ${file}\n[${line},${column}]`);
      return;
    },
  },
});

// @ts-ignore
addEventListener(
  "message",
  (input: {
    data: {
      wasm: ArrayBuffer;
      method: string;
      input: Record<string, unknown> | ArrayBuffer;
      threadMutexesBuffer: SharedArrayBuffer;
      threadId: number;
      transferBuffer: SharedArrayBuffer;
    };
  }) => {
    const data = input.data;

    // Store thread mutexes & ID, used for pausing the thread's execution
    state.threadMutexes = new Int32Array(
      data.threadMutexesBuffer,
      0,
      maxThreads
    );
    state.threadId = data.threadId;

    // Store transfer buffer
    state.transfer = new Uint8Array(data.transferBuffer, 0, maxTransferBytes);

    // Store the method we're invoking
    state.method = data.method;

    if (data.input instanceof ArrayBuffer) {
      // No need to serialize
      state.args = data.input;
    } else {
      // We must serialize the input object into msgpack
      state.args = encode(data.input);
    }

    const module = new WebAssembly.Module(data.wasm);
    const memory = new WebAssembly.Memory({ initial: 1 });
    const source = new WebAssembly.Instance(module, imports(memory));

    const exports = source.exports as W3Exports;

    const hasExport = (
      name: string,
      exports: Record<string, unknown>
    ): boolean => {
      if (!exports[name]) {
        abort(`A required export was not found: ${name}`);
        return false;
      }

      return true;
    };

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

    if (result) {
      if (!state.invoke.result) {
        abort(`Invoke result is missing.`);
        return;
      }

      // __w3_invoke_result has already been called
      dispatchAction({
        type: "LogQueryResult",
        result: state.invoke.result,
      });
    } else {
      if (!state.invoke.error) {
        abort(`Invoke error is missing.`);
        return;
      }

      // __w3_invoke_error has already been called
      dispatchAction({
        type: "LogQueryError",
        error: state.invoke.error,
      });
    }
  }
);
