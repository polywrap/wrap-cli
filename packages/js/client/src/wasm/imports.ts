/* eslint-disable @typescript-eslint/naming-convention */

import { u32, W3Exports, W3Imports } from "./types";
import { WasmPromise } from "./WasmPromise";
import { readBytes, readString, writeBytes, writeString } from "./utils";
import { Client, InvokableModules } from "..";
import { State } from "./WasmWeb3Api";

import * as MsgPack from "@msgpack/msgpack";

export const createImports = (importArgs: {
  client: Client;
  exports: { values: W3Exports };
  memory: WebAssembly.Memory;
  state: State;
}): W3Imports => {
  const { memory, client, exports, state } = importArgs;

  return {
    w3: {
      __w3_subinvoke: WasmPromise.create(
        async (
          uriPtr: u32,
          uriLen: u32,
          modulePtr: u32,
          moduleLen: u32,
          methodPtr: u32,
          methodLen: u32,
          inputPtr: u32,
          inputLen: u32
        ): Promise<boolean> => {
          // Reset our state
          state.subinvoke.result = undefined;
          state.subinvoke.error = undefined;

          console.log("URI 2: ", memory.buffer, " ", uriPtr, " ", uriLen);

          const uri = readString(memory.buffer, uriPtr, uriLen);
          console.log("URI 1: ", uri);
          const moduleToInvoke = readString(
            memory.buffer,
            modulePtr,
            moduleLen
          );
          const method = readString(memory.buffer, methodPtr, methodLen);
          const input = readBytes(memory.buffer, inputPtr, inputLen);

          const { data, error } = await client.invoke<unknown | ArrayBuffer>({
            uri: uri,
            module: moduleToInvoke as InvokableModules,
            method: method,
            input: input,
          });

          console.log("RESULT: ", data, " ", error);

          if (!error) {
            let msgpack: ArrayBuffer;
            if (data instanceof ArrayBuffer) {
              msgpack = data;
            } else {
              msgpack = MsgPack.encode(data);
            }

            state.subinvoke.result = msgpack;
          } else {
            state.subinvoke.error = `${error.name}: ${error.message}`;
          }

          return !error;
        },
        () => {
          return state.method as string;
        },
        {
          memory,
          exports,
        }
      ),
      // Give WASM the size of the result
      __w3_subinvoke_result_len: (): u32 => {
        if (!state.subinvoke.result) {
          state.invokeResult = {
            type: "Abort",
            message: "__w3_subinvoke_result_len: subinvoke.result is not set",
          };
          return 0;
        }
        return state.subinvoke.result.byteLength;
      },
      // Copy the subinvoke result into WASM
      __w3_subinvoke_result: (ptr: u32): void => {
        if (!state.subinvoke.result) {
          state.invokeResult = {
            type: "Abort",
            message: "__w3_subinvoke_result: subinvoke.result is not set",
          };
          return;
        }
        writeBytes(state.subinvoke.result, memory.buffer, ptr);
      },
      // Give WASM the size of the error
      __w3_subinvoke_error_len: (): u32 => {
        if (!state.subinvoke.error) {
          state.invokeResult = {
            type: "Abort",
            message: "__w3_subinvoke_error_len: subinvoke.error is not set",
          };
          return 0;
        }
        return state.subinvoke.error.length;
      },
      // Copy the subinvoke error into WASM
      __w3_subinvoke_error: (ptr: u32): void => {
        if (!state.subinvoke.error) {
          state.invokeResult = {
            type: "Abort",
            message: "__w3_subinvoke_error: subinvoke.error is not set",
          };
          return;
        }
        writeString(state.subinvoke.error, memory.buffer, ptr);
      },
      // Copy the invocation's method & args into WASM
      __w3_invoke_args: (methodPtr: u32, argsPtr: u32): void => {
        if (!state.method) {
          state.invokeResult = {
            type: "Abort",
            message: "__w3_invoke_args: method is not set",
          };
          return;
        }
        if (!state.args) {
          state.invokeResult = {
            type: "Abort",
            message: "__w3_invoke_args: args is not set",
          };
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
      __w3_abort: (
        msgPtr: u32,
        msgLen: u32,
        filePtr: u32,
        fileLen: u32,
        line: u32,
        column: u32
      ): void => {
        const msg = readString(memory.buffer, msgPtr, msgLen);
        const file = readString(memory.buffer, filePtr, fileLen);
        state.invokeResult = {
          type: "Abort",
          message: `__w3_abort: ${msg}\nFile: ${file}\nLocation: [${line},${column}]`,
        };
      },
    },
    env: {
      memory,
    },
  };
};
