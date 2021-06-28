/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

import { HostAction, u32, W3Exports } from "./types";
import { WasmPromise } from "./thread";
import { readBytes, readString, writeBytes, writeString } from "./utils";

import {
  InvokeApiOptions,
  InvokeApiResult,
  Api,
  Web3ApiManifest,
  Uri,
  Client,
  ApiResolver,
  InvokableModules,
} from "@web3api/core-js";
import * as MsgPack from "@msgpack/msgpack";
import { Tracer } from "@web3api/tracing-js";

interface State {
  invoke: {
    result?: ArrayBuffer;
    error?: string;
  };
  subinvoke: {
    result?: ArrayBuffer;
    error?: string;
  };
}

const createImports = (importArgs: {
  DATA_ADDR: number;
  view: Int32Array;
  exports: W3Exports;
  memory: WebAssembly.Memory;
  args: ArrayBuffer;
}) => {
  const { DATA_ADDR, view, exports, memory, args } = importArgs;
  const state: State = {
    invoke: {},
    subinvoke: {},
  };
  let sleeping = false;

  return {
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
        const uri = readString(memory.buffer, uriPtr, uriLen);
        const module = readString(memory.buffer, modulePtr, moduleLen);
        const method = readString(memory.buffer, methodPtr, methodLen);
        const input = readBytes(memory.buffer, inputPtr, inputLen);

        const result = exports._w3_invoke(method.length, args.byteLength);

        const { data, error } = invokeResult;

        const transferStatus: ThreadWakeStatus = error
          ? ThreadWakeStatus.SUBINVOKE_ERROR
          : ThreadWakeStatus.SUBINVOKE_RESULT;

        // Transfer is complete, copy result to desired location
        if (transferStatus === ThreadWakeStatus.SUBINVOKE_ERROR) {
          const decoder = new TextDecoder();
          state.subinvoke.error = decoder.decode(data);
          return false;
        } else if (transferStatus === ThreadWakeStatus.SUBINVOKE_RESULT) {
          state.subinvoke.result = data;
          return true;
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
        abort(
          `__w3_abort: ${msg}\nFile: ${file}\nLocation: [${line},${column}]`
        );
      },
      __w3_wake_up: () => {
        exports.asyncify_start_rewind(DATA_ADDR);
        exports.main();
      },
      __w3_sleep: () => {
        if (!sleeping) {
          view[DATA_ADDR >> 2] = DATA_ADDR + 8;
          view[(DATA_ADDR + 4) >> 2] = 1024;

          exports.asyncify_start_unwind(DATA_ADDR);
          sleeping = true;
        } else {
          exports.asyncify_stop_rewind();
          sleeping = false;
        }
      },
      env: {
        memory,
      },
    },
  };
};

export class WasmWeb3Api extends Api {
  private _schema?: string;

  private _wasm: {
    query?: ArrayBuffer;
    mutation?: ArrayBuffer;
  } = {};

  constructor(
    private _uri: Uri,
    private _manifest: Web3ApiManifest,
    private _apiResolver: Uri
  ) {
    super();

    Tracer.startSpan("WasmWeb3Api: constructor");
    Tracer.setAttribute("input", {
      uri: this._uri,
      manifest: this._manifest,
      apiResolver: this._apiResolver,
    });
    Tracer.endSpan();
  }

  public async invoke(
    options: InvokeApiOptions,
    client: Client
  ): Promise<InvokeApiResult<unknown | ArrayBuffer>> {
    const run = Tracer.traceFunc(
      "WasmWeb3Api: invoke",
      async (
        options: InvokeApiOptions,
        client: Client
      ): Promise<InvokeApiResult<unknown | ArrayBuffer>> => {
        const { module: invokableModule, method, input, decode } = options;

        // Fetch the WASM module
        const wasm = await this.getWasmModule(invokableModule, client);

        let state: "Abort" | "LogQueryError" | "LogQueryResult" | undefined;
        let abortMessage: string | undefined;
        let queryResult: ArrayBuffer | undefined;
        let queryError: string | undefined;

        const args =
          input instanceof ArrayBuffer
            ? input
            : MsgPack.encode(input, { ignoreUndefined: true });
        const module = new WebAssembly.Module(wasm);
        const memory = new WebAssembly.Memory({ initial: 1 });

        const importArgs = {
          DATA_ADDR: 16,
          view: new Int32Array(memory.buffer),
          exports: {} as W3Exports,
          args,
          subinvokeOptions: {
            aInternal: undefined,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            aListener: function () {},
            set a(val: InvokeApiOptions | undefined) {
              this.aInternal = val;
              this.aListener(val);
            },
            get a(): InvokeApiOptions | undefined {
              return this.aInternal;
            },
            registerListener: function (
              listener: (val: InvokeApiOptions | undefined) => void
            ) {
              this.aListener = listener;
            },
          },
        };

        importArgs.subinvokeOptions.registerListener(function (
          opts: InvokeApiOptions | undefined
        ) {
          if (opts) {
            
          } else {
          }
        });

        const source = new WebAssembly.Instance(module);

        importArgs.exports = source.exports as W3Exports;

        // await awaitCompletion;

        WasmPromise.create<void>((resolve) => {
          worker.addEventListener(
            "message",
            async (event: { data: HostAction }) => {
              const action = event.data;

              Tracer.addEvent("worker-message", action);

              switch (action.type) {
                case "Abort": {
                  abortMessage = action.message;
                  state = action.type;
                  resolve();
                  break;
                }
                case "LogQueryError": {
                  queryError = action.error;
                  state = action.type;
                  resolve();
                  break;
                }
                case "LogQueryResult": {
                  queryResult = action.result;
                  state = action.type;
                  resolve();
                  break;
                }
                // TODO: replace with proper logging
                case "LogInfo": {
                  break;
                }
                case "SubInvoke": {
                  break;
                }
                case "TransferComplete": {
                  break;
                }
              }
            }
          );
        });

        if (!state) {
          throw Error("WasmWeb3Api: query state was never set.");
        }

        switch (state) {
          case "Abort": {
            return {
              error: new Error(
                `WasmWeb3Api: Thread aborted execution.\nURI: ${this._uri.uri}\n` +
                  `Module: ${module}\nMethod: ${method}\n` +
                  `Input: ${JSON.stringify(
                    input,
                    null,
                    2
                  )}\nMessage: ${abortMessage}\n`
              ),
            };
          }
          case "LogQueryError": {
            return {
              error: new Error(
                `WasmWeb3Api: invocation exception encountered.\n` +
                  `uri: ${this._uri.uri}\nmodule: ${module}\n` +
                  `method: ${method}\n` +
                  `input: ${JSON.stringify(input, null, 2)}\n` +
                  `exception: ${queryError}`
              ),
            };
          }
          case "LogQueryResult": {
            if (decode) {
              try {
                return { data: MsgPack.decode(queryResult as ArrayBuffer) };
              } catch (err) {
                throw Error(
                  `WasmWeb3Api: Failed to decode query result.\nResult: ${JSON.stringify(
                    queryResult
                  )}\nError: ${err}`
                );
              }
            } else {
              return { data: queryResult };
            }
          }
          default: {
            throw Error(`WasmWeb3Api: Unknown state "${state}"`);
          }
        }
      }
    );

    return run(options, client).catch((error: Error) => {
      return {
        error,
      };
    });
  }

  public async getSchema(client: Client): Promise<string> {
    const run = Tracer.traceFunc(
      "WasmWeb3Api: getSchema",
      async (client: Client): Promise<string> => {
        if (this._schema) {
          return this._schema;
        }

        // Either the query or mutation module will work,
        // as they share the same schema file
        const module =
          this._manifest.modules.mutation || this._manifest.modules.query;

        if (!module) {
          // TODO: this won't work for abstract APIs
          throw Error(`WasmWeb3Api: No module was found.`);
        }

        const { data, error } = await ApiResolver.Query.getFile(
          client,
          this._apiResolver,
          this.combinePaths(this._uri.path, module.schema)
        );

        if (error) {
          throw error;
        }

        // If nothing is returned, the schema was not found
        if (!data) {
          throw Error(
            `WasmWeb3Api: Schema was not found.\nURI: ${this._uri}\nSubpath: ${module.schema}`
          );
        }

        const decoder = new TextDecoder();
        this._schema = decoder.decode(data);

        if (!this._schema) {
          throw Error(
            `WasmWeb3Api: Decoding the schema's bytes array failed.\nBytes: ${data}`
          );
        }

        return this._schema;
      }
    );

    return run(client);
  }

  private async getWasmModule(
    module: InvokableModules,
    client: Client
  ): Promise<ArrayBuffer> {
    const run = Tracer.traceFunc(
      "WasmWeb3Api: getWasmModule",
      async (
        module: InvokableModules,
        client: Client
      ): Promise<ArrayBuffer> => {
        if (this._wasm[module] !== undefined) {
          return this._wasm[module] as ArrayBuffer;
        }

        const moduleManifest = this._manifest.modules[module];

        if (!moduleManifest) {
          throw Error(
            `Package manifest does not contain a definition for module "${module}"`
          );
        }

        const { data, error } = await ApiResolver.Query.getFile(
          client,
          this._apiResolver,
          this.combinePaths(this._uri.path, moduleManifest.module)
        );

        if (error) {
          throw Error(`ApiResolver.Query.getFile Failed: ${error}`);
        }

        // If nothing is returned, the module was not found
        if (!data) {
          throw Error(
            `Module was not found.\nURI: ${this._uri}\nSubpath: ${moduleManifest.module}`
          );
        }

        this._wasm[module] = data;
        return data;
      }
    );

    return run(module, client);
  }

  private combinePaths(a: string, b: string) {
    // Normalize all path seperators
    a = a.replace(/\\/g, "/");
    b = b.replace(/\\/g, "/");

    // Append a seperator if one doesn't exist
    if (a[a.length - 1] !== "/") {
      a += "/";
    }

    // Remove any leading seperators from
    while (b[0] === "/" || b[0] === ".") {
      b = b.substr(1);
    }

    return a + b;
  }
}
