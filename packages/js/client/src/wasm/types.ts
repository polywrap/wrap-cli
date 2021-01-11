import { Observable } from "observable-fns";

export type usize = number;

export interface W3Exports {
  _w3_init: () => void;
}

export interface W3Imports {
  w3: {
    __w3_subquery: (
      uriPtr: usize, uriLen: usize,
      queryPtr: usize, queryLen: usize,
      argsPtr: usize, argsLen: usize
    ) => boolean;
    __w3_subquery_result_len: () => usize;
    __w3_subquery_result: (ptr: usize) => void;
    __w3_subquery_error_len: () => usize;
    __w3_subquery_error: (ptr: usize) => void;
    __w3_invoke_args: (namePtr: usize, argsPtr: usize) => void;
    __w3_invoke_result: (ptr: usize, len: usize) => void;
    __w3_invoke_error: (ptr: usize, len: usize) => void;
  }
}

export type HostAction =
  SubQueryAction

export interface SubQueryAction {
  readonly type: "SubQuery"
  readonly uri: string;
  readonly query: string;
  readonly args: ArrayBuffer;
}

export type HostDispatcher = Observable<HostAction>

export interface ThreadMethods {
  start: (
    wasm: ArrayBuffer,
    method: string,
    input: Record<string, unknown> | ArrayBuffer
  ) => HostDispatcher;
  subQueryResult: (result: ArrayBuffer) => void;
  subQueryError: (error: string) => void;
}
