import { expose } from "threads/worker";
import { MethodDefinition } from "@web3api/schema-parse";

export interface WasmState {
}

const state: WasmState = {
}

const methods = {
  start: (
    wasm: ArrayBuffer,
    method: string,
    input: Record<string, unknown>,
    methodDef: MethodDefinition
  ): WasmState => {
    // TODO:
    // - serialize input to msgpack based on methodDef
    // - exec method on module w/ input arguments
    return { };
  }
}

export type WasmThread = typeof methods;

expose(methods);
