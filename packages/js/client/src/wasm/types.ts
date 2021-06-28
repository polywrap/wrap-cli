/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */

export const maxTransferBytes = 256; // do not change
export const maxThreads = 128;

export type u32 = number;

export interface W3Exports {
  // Needed to comply with WebAssembly's typings
  [key: string]: unknown;

  asyncify_start_unwind: (dataAddr: number) => void;
  asyncify_start_rewind: (dataAddr: number) => void;
  asyncify_stop_rewind: () => void;

  main: () => void;

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
    ) => boolean;
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
    // sleep: () => void;
    // wakeUp: () => void;
  };
}

export enum ThreadWakeStatus {
  SUBINVOKE_RESULT = 1,
  SUBINVOKE_ERROR = 2,
  SUBINVOKE_DONE = 3,
}

// Host (main thread) actions
export type HostAction =
  | SubInvokeAction
  | AbortAction
  | LogQueryResultAction
  | LogQueryErrorAction
  | LogInfoAction
  | TransferCompleteAction;

export interface SubInvokeAction {
  readonly type: "SubInvoke";
  readonly uri: string;
  readonly module: string;
  readonly method: string;
  readonly input: ArrayBuffer;
}

export interface AbortAction {
  readonly type: "Abort";
  readonly message: string;
}

export interface LogQueryResultAction {
  readonly type: "LogQueryResult";
  readonly result: ArrayBuffer;
}

export interface LogQueryErrorAction {
  readonly type: "LogQueryError";
  readonly error: string;
}

export interface LogInfoAction {
  readonly type: "LogInfo";
  readonly message: string;
}

export interface TransferCompleteAction {
  readonly type: "TransferComplete";
}
