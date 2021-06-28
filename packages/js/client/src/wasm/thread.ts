/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-constant-condition */

import { W3Exports, HostAction, maxTransferBytes } from "./types";

import * as MsgPack from "@msgpack/msgpack";

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

export class WasmPromise<T> {
  private _result: T;
  private _exports: any;
  private _view: Int32Array;
  private _dataAddr: number;
  private _sleeping = false;

  static create = <T>(
    func: (resolve: (data: T) => void) => void,
    args: {
      exports: any;
      view: Int32Array;
      dataAddress: number;
    }
  ): T => {
    const instance = new WasmPromise<T>();
    instance._exports = args.exports;
    instance._view = args.view;
    instance._dataAddr = args.dataAddress;

    instance.sleepThread();

    func(instance.wakeUpThread);

    return instance._result;
  };

  private wakeUpThread = (resolvedData: T) => {
    this._exports.asyncify_start_rewind(this._dataAddr);
    this._exports.main();

    this._result = resolvedData;
  };

  private sleepThread = () => {
    if (!this._sleeping) {
      this._view[this._dataAddr >> 2] = this._dataAddr + 8;
      this._view[(this._dataAddr + 4) >> 2] = 1024;

      this._exports.asyncify_start_unwind(this._dataAddr);
      this._sleeping = true;
    } else {
      // We are called as part of a resume/rewind. Stop sleeping.
      console.log("...resume");
      this._exports.asyncify_stop_rewind();
      this._sleeping = false;
    }
  };
}

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

    // Store transfer buffer
    state.transfer = new Uint8Array(data.transferBuffer, 0, maxTransferBytes);

    // Store the method we're invoking
    state.method = data.method;

    if (data.input instanceof ArrayBuffer) {
      // No need to serialize
      state.args = data.input;
    } else {
      // We must serialize the input object into msgpack
      state.args = MsgPack.encode(data.input, { ignoreUndefined: true });
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
