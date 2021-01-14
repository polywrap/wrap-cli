import { Observable } from "observable-fns";

export type u32 = number;

export interface W3Exports {
  _w3_init: () => void;
  _w3_invoke: (nameLen: u32, argsLen: u32) => boolean;

  // Needed to comply with WebAssembly's typings
  [key: string]: unknown;
}

export interface W3Imports {
  w3: {
    __w3_subinvoke: (
      uriPtr: u32, uriLen: u32,
      modulePtr: u32, moduleLen: u32,
      methodPtr: u32, methodLen: u32,
      inputPtr: u32, inputLen: u32
    ) => boolean;
    __w3_subinvoke_result_len: () => u32;
    __w3_subinvoke_result: (ptr: u32) => void;
    __w3_subinvoke_error_len: () => u32;
    __w3_subinvoke_error: (ptr: u32) => void;
    __w3_invoke_args: (methodPtr: u32, argsPtr: u32) => void;
    __w3_invoke_result: (ptr: u32, len: u32) => void;
    __w3_invoke_error: (ptr: u32, len: u32) => void;
  };

  env: {
    memory: WebAssembly.Memory;
    abort: (msg: string, file: string, line: number, column: number) => void;
  };

  // Needed to comply with WebAssembly's typings
  [key: string]: Record<string, Function | WebAssembly.Memory>;
}

// Host (main thread) actions
export type HostAction =
  SubInvokeAction |
  AbortAction |
  LogQueryResultAction |
  LogQueryErrorAction;

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

export type HostDispatcher = Observable<HostAction>
