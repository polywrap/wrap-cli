import { Observable } from "observable-fns";

export type usize = number;

export interface W3Exports {
  _w3_init: () => void;
  _w3_invoke: (nameLen: usize, argsLen: usize) => boolean;

  // Needed to comply with WebAssembly's typings
  [key: string]: unknown;
}

export interface W3Imports {
  w3: {
    __w3_subinvoke: (
      uriPtr: usize, uriLen: usize,
      modulePtr: usize, moduleLen: usize,
      methodPtr: usize, methodLen: usize,
      inputPtr: usize, inputLen: usize
    ) => boolean;
    __w3_subinvoke_result_len: () => usize;
    __w3_subinvoke_result: (ptr: usize) => void;
    __w3_subinvoke_error_len: () => usize;
    __w3_subinvoke_error: (ptr: usize) => void;
    __w3_invoke_args: (methodPtr: usize, argsPtr: usize) => void;
    __w3_invoke_result: (ptr: usize, len: usize) => void;
    __w3_invoke_error: (ptr: usize, len: usize) => void;
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
