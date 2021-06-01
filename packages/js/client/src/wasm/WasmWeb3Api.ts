/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

import {
  HostAction,
  ThreadWakeStatus,
  maxThreads,
  maxTransferBytes,
} from "./types";
import { sleep } from "./utils";

import {
  InvokeApiOptions,
  InvokeApiResult,
  Api,
  Manifest,
  Uri,
  Client,
  ApiResolver,
  InvokableModules,
} from "@web3api/core-js";
import path from "path";
import * as MsgPack from "@msgpack/msgpack";
import { Tracer } from "@web3api/tracing-js";

export class WasmWeb3Api extends Api {
  private _schema?: string;

  private _wasm: {
    query?: ArrayBuffer;
    mutation?: ArrayBuffer;
  } = {};

  constructor(
    private _uri: Uri,
    private _manifest: Manifest,
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
        const { module, method, input, decode } = options;

        // Fetch the WASM module
        const wasm = await this.getWasmModule(module, client);

        /// TAKEN FROM THREAD.TS

        if (options.input instanceof ArrayBuffer) {
          // No need to serialize
          state.args = options.input;
        } else {
          // We must serialize the input object into msgpack
          state.args = encode(options.input);
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

        /// TAKEN FROM THREAD.TS

        let state: "Abort" | "LogQueryError" | "LogQueryResult" | undefined;
        let abortMessage: string | undefined;
        let queryResult: ArrayBuffer | undefined;
        let queryError: string | undefined;

        const awaitCompletion = new Promise(
          (resolve: (value?: unknown) => void) => {
            let transferPending = false;
            const transferData = async (data: ArrayBuffer, status: number) => {
              Tracer.startSpan("WasmWeb3Api: invoke: transferData");
              Tracer.setAttribute("input", { data, status });

              let progress = 0;
              const totalBytes = data.byteLength;
              const dataView = new Uint8Array(data);

              while (progress < totalBytes) {
                // Reset the transfer buffer
                transfer.fill(0);

                // Calculate how many bytes we can send
                const bytesLeft = totalBytes - progress;
                const bytesToSend = Math.min(bytesLeft, maxTransferBytes - 1);

                // Set the first byte to the number of bytes we're sending
                transfer.set([bytesToSend]);

                // Copy our data in
                transfer.set(
                  dataView.slice(progress, progress + bytesToSend),
                  1
                );

                transferPending = true;
                progress += bytesToSend;

                // Notify the thread that we've sent data, giving it a specific
                // status code
                Atomics.store(threadMutexes, threadId, status);
                Atomics.notify(threadMutexes, threadId, Infinity);

                // Wait until the transferPending flag has been reset
                while (transferPending) {
                  await sleep(100);
                }
              }

              Atomics.store(
                threadMutexes,
                threadId,
                ThreadWakeStatus.SUBINVOKE_DONE
              );
              Atomics.notify(threadMutexes, threadId, Infinity);

              Tracer.endSpan();
            };

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
                    transferPending = false;
                    break;
                  }
                }
              }
            );
          }
        );

        Tracer.addEvent("worker-started", {
          method,
          input,
          threadId,
        });

        // Start the thread
        worker.postMessage({
          wasm,
          method,
          input,
          threadMutexesBuffer,
          threadId,
          transferBuffer,
        });

        await awaitCompletion;

        Atomics.store(threadMutexes, threadId, 0);
        worker.terminate();
        threadsActive--;

        Tracer.addEvent("worker-terminated", state);

        if (!state) {
          throw Error("WasmWeb3Api: query state was never set.");
        }

        switch (state) {
          case "Abort": {
            return {
              error: new Error(
                `WasmWeb3Api: Thread aborted execution.\nMessage: ${abortMessage}`
              ),
            };
          }
          case "LogQueryError": {
            return {
              error: new Error(
                `WasmWeb3Api: invocation exception encourtered.\n` +
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

    return run(options, client).catch((error) => {
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
        const module = this._manifest.query || this._manifest.mutation;

        if (!module) {
          // TODO: this won't work for abstract APIs
          throw Error(`WasmWeb3Api: No module was found.`);
        }

        const { data, error } = await ApiResolver.Query.getFile(
          client,
          this._apiResolver,
          path.join(this._uri.path, module.schema.file)
        );

        if (error) {
          throw error;
        }

        // If nothing is returned, the schema was not found
        if (!data) {
          throw Error(
            `WasmWeb3Api: Schema was not found.\nURI: ${this._uri}\nSubpath: ${module.schema.file}`
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

        const moduleManifest = this._manifest[module];

        if (!moduleManifest) {
          throw Error(
            `Package manifest does not contain a definition for module "${module}"`
          );
        }

        const { data, error } = await ApiResolver.Query.getFile(
          client,
          this._apiResolver,
          path.join(this._uri.path, moduleManifest.module.file)
        );

        if (error) {
          throw error;
        }

        // If nothing is returned, the module was not found
        if (!data) {
          throw Error(
            `Module was not found.\nURI: ${this._uri}\nSubpath: ${moduleManifest.module.file}`
          );
        }

        this._wasm[module] = data;
        return data;
      }
    );

    return run(module, client);
  }
}
