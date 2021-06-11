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
import * as MsgPack from "@msgpack/msgpack";
import { Tracer } from "@web3api/tracing-js";

const Worker = require("web-worker");

let threadsActive = 0;
let threadAvailable = 0;
const threadMutexesBuffer = new SharedArrayBuffer(
  maxThreads * Int32Array.BYTES_PER_ELEMENT
);
const threadMutexes = new Int32Array(threadMutexesBuffer, 0, maxThreads);

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

        // TODO: come up with a better future-proof solution
        while (threadsActive >= maxThreads) {
          // Wait for another thread to become available
          await sleep(500);
        }

        threadsActive++;
        const threadId = threadAvailable++;

        Tracer.addEvent("threadId", threadId);

        // Wrap the queue
        if (threadAvailable >= maxThreads) {
          threadAvailable = 0;
        }

        Atomics.store(threadMutexes, threadId, 0);

        // Spawn the worker thread
        let modulePath = process.env.WEB3API_THREAD_PATH || "./thread.js";

        // If we're in node.js
        if (typeof process === "object" && typeof window === "undefined") {
          modulePath = `file://${__dirname}/thread.js`;

          if (process.env.TEST) {
            modulePath = `file://${__dirname}/thread-loader.js`;
          }
        }

        const worker = new Worker(modulePath);

        // Our transfer buffer, used to send data to the thread atomically.
        // The first byte in the transfer array specifies how many bytes are in the array (max 255).
        const transferBuffer = new SharedArrayBuffer(
          maxTransferBytes * Uint8Array.BYTES_PER_ELEMENT
        );
        const transfer = new Uint8Array(transferBuffer, 0, maxTransferBytes);

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
                    const { data, error } = await client.invoke<
                      unknown | ArrayBuffer
                    >({
                      uri: action.uri,
                      module: action.module as InvokableModules,
                      method: action.method,
                      input: action.input,
                    });

                    if (!error) {
                      let msgpack: ArrayBuffer;
                      if (data instanceof ArrayBuffer) {
                        msgpack = data;
                      } else {
                        msgpack = MsgPack.encode(data);
                      }

                      // transfer the result
                      await transferData(
                        msgpack,
                        ThreadWakeStatus.SUBINVOKE_RESULT
                      );
                    } else {
                      const encoder = new TextEncoder();
                      const bytes = encoder.encode(
                        `${error.name}: ${error.message}`
                      );

                      // transfer the error
                      await transferData(
                        bytes,
                        ThreadWakeStatus.SUBINVOKE_ERROR
                      );
                    }

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
          this.combinePaths(this._uri.path, module.schema.file)
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
          this.combinePaths(this._uri.path, moduleManifest.module.file)
        );

        if (error) {
          throw Error(`ApiResolver.Query.getFile Failed: ${error}`);
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
