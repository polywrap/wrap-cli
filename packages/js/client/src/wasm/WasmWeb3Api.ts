import { HostAction, ThreadWakeStatus } from "./types";

import {
  InvokeApiOptions,
  InvokeApiResult,
  Api,
  Manifest,
  Uri,
  Client,
  ApiResolver,
  InvokableModules
} from "@web3api/core-js";
import {
  parseSchema,
  TypeInfo,
  QueryDefinition,
  MethodDefinition,
} from "@web3api/schema-parse";
import path from "path";
import * as MsgPack from "@msgpack/msgpack";

const Worker = require("web-worker");

export const maxTransferBytes: number = 256; // do not change
export const maxThreads: number = 128;
let threadsActive: number = 0;
const threadMutexesBuffer = new SharedArrayBuffer(maxThreads * Int32Array.BYTES_PER_ELEMENT);
const threadMutexes = new Int32Array(threadMutexesBuffer, 0, maxThreads);

export class WasmWeb3Api extends Api {
  private _schema?: string;
  private _typeInfo?: TypeInfo;

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
  }

  public async invoke(
    options: InvokeApiOptions,
    client: Client
  ): Promise<InvokeApiResult<unknown | ArrayBuffer>> {
    const { module, method, input, decode } = options;

    // Fetch the schema
    const schema = await this.getSchema(client);

    // Get the schema's type info
    const typeInfo = this.getTypeInfo(schema);

    const root: "Query" | "Mutation" =
      module === "query" ? "Query" : "Mutation";

    // TODO: this error checking may not be needed, as it's handled by the thread
    //       if that's the case, we have no need for the schema's TypeInfo, which is good

    // Ensure the schema contains the query module being asked for
    const queryIdx = typeInfo.queryTypes.findIndex(
      (item: QueryDefinition) => item.name === root
    );

    if (queryIdx === -1) {
      throw Error(
        `WasmWeb3Api: Unable to find query type by the name of "${root}".`
      );
    }

    const queryInfo = typeInfo.queryTypes[queryIdx];

    // Ensure the query module contains the method being asked for
    const methodIdx = queryInfo.methods.findIndex(
      (item: MethodDefinition) => item.name === method
    );

    if (methodIdx === -1) {
      throw Error(
        `WasmWeb3Api: Unable to find method "${method}" on query type "${root}".`
      );
    }

    // Fetch the WASM module
    const wasm = await this.getWasmModule(module, client);

    // TODO: come up with a better future-proof solution
    while (threadsActive >= maxThreads) {
      // Wait for another thread to become available
      await new Promise((resolve) => setTimeout(() => resolve(), 500));
    }

    const threadId = threadsActive++;
    Atomics.store(
      threadMutexes,
      threadId,
      0
    );

    // Spawn the worker thread
    let modulePath = 'thread.js';
    if (process.env.TEST) {
      modulePath = 'thread-loader.js';
    }

    const worker = new Worker(path.join(__dirname, modulePath));

    // Our transfer buffer, used to send data to the thread atomically.
    // The first byte in the transfer array specifies how many bytes are in the array (max 255).
    const transferBuffer = new SharedArrayBuffer(maxTransferBytes * Uint8Array.BYTES_PER_ELEMENT);
    const transfer = new Uint8Array(transferBuffer, 0, maxTransferBytes);

    let state: "Abort" | "LogQueryError" | "LogQueryResult" | undefined;
    let abortMessage: string | undefined;
    let queryResult: ArrayBuffer | undefined;
    let queryError: string | undefined;

    const awaitCompletion = new Promise((resolve) => {

      let transferPending = false;
      const transferData = async (data: ArrayBuffer, status: number) => {

        let progress = 0;
        const totalBytes = data.byteLength;
        const dataView = new Uint8Array(data);

        while (progress < totalBytes) {

          // Reset the transfer buffer
          transfer.fill(0);

          // Calculate how many bytes we can send
          const bytesLeft = totalBytes - progress;
          const bytesToSend = Math.min(bytesLeft, (maxTransferBytes - 1));

          // Set the first byte to the number of bytes we're sending
          transfer.set([bytesToSend]);

          // Copy our data in
          transfer.set(
            dataView.slice(progress, progress + bytesToSend), 1
          );

          transferPending = true;
          progress += bytesToSend;

          // Notify the thread that we've sent data, giving it a specific
          // status code
          Atomics.store(threadMutexes, threadId, status);
          Atomics.notify(threadMutexes, threadId, Infinity);

          // Wait until the transferPending flag has been reset
          while (transferPending) {
            await new Promise((resolve) => setTimeout(
              () => resolve(), 100
            ));
          }
        }

        Atomics.store(threadMutexes, threadId, ThreadWakeStatus.SUBINVOKE_DONE);
        Atomics.notify(threadMutexes, threadId, Infinity);
      };

      worker.addEventListener('message', async (event: { data: HostAction }) => {

        const action = event.data;

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
            console.log(action.message);
            break;
          }
          case "SubInvoke": {
            const { data, error } = await client.invoke<
              unknown | ArrayBuffer
            >({
              uri: new Uri(action.uri),
              module: action.module as InvokableModules,
              method: action.method,
              input: action.input
            });

            if (!error) {
              let msgpack: ArrayBuffer;
              if (data instanceof ArrayBuffer) {
                msgpack = data;
              } else {
                msgpack = MsgPack.encode(data);
              }

              // transfer the result
              await transferData(msgpack, ThreadWakeStatus.SUBINVOKE_RESULT);
            } else {
              const encoder = new TextEncoder();
              const bytes = encoder.encode(`${error.name}: ${error.message}`);

              // transfer the error
              await transferData(bytes, ThreadWakeStatus.SUBINVOKE_ERROR);
            }

            break;
          }
          case "TransferComplete": {
            transferPending = false;
            break;
          }
        }
      });
    });

    // Start the thread
    worker.postMessage({
      wasm,
      method,
      input,
      threadMutexesBuffer,
      threadId,
      transferBuffer
    });

    await awaitCompletion;

    worker.terminate();
    threadsActive--;

    if (!state) {
      throw Error("WasmWeb3Api: query state was never set.");
    }

    switch (state) {
      case "Abort": {
        return {
          error: new Error(
            `WasmWeb3Api: Thread aborted execution.\nMessage: ${abortMessage}`
          )
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
          )
        };
      }
      case "LogQueryResult": {
        if (decode) {
          return { data: MsgPack.decode(queryResult as ArrayBuffer) };
        } else {
          return { data: queryResult };
        }
      }
      default: {
        throw Error(`WasmWeb3Api: Unknown state "${state}"`);
      }
    }
  }

  public async getSchema(client: Client): Promise<string> {
    if (this._schema) {
      return this._schema;
    }

    const module = this._manifest.query || this._manifest.mutation;

    if (!module) {
      // TODO: this won't work for abstract APIs
      throw Error(
        `WasmWeb3Api: No module was found.`
      );
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

  private getTypeInfo(schema: string): TypeInfo {
    if (!this._typeInfo) {
      this._typeInfo = parseSchema(schema);
    }

    return this._typeInfo;
  }

  private async getWasmModule(
    module: InvokableModules,
    client: Client
  ): Promise<ArrayBuffer> {
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
}
