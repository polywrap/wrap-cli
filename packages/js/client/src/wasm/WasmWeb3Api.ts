import { HostAction } from "./types";
import { ThreadMethods } from "./thread";

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
import { spawn, Thread, Worker } from "threads";
import path from "path";

const maxThreads: number = 500;
let threadsActive: number = 0;
const threadMutexesBuffer = new SharedArrayBuffer(maxThreads);
const threadMutexes = new Int32Array(threadMutexesBuffer);

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
  ): Promise<InvokeApiResult<ArrayBuffer>> {
    const { module, method, input } = options;

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

    const thread = await spawn<ThreadMethods>(
      new Worker("./thread")
    );

    const dispatcher = thread.start(
      wasm,
      method,
      input,
      threadMutexesBuffer,
      threadId
    );

    let state: "Abort" | "LogQueryError" | "LogQueryResult" | undefined;
    let abortMessage: string | undefined;
    let queryResult: ArrayBuffer | undefined;
    let queryError: string | undefined;

    await new Promise((resolve) => {
      dispatcher.subscribe(async (action: HostAction) => {
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
          case "SubInvoke": {
            const { data, error } = await client.invoke({
              uri: new Uri(action.uri),
              module: action.module as InvokableModules,
              method: action.method,
              input: action.input
            });

            if (!error) {
              thread.subInvokeResult(data);
            } else {
              thread.subInvokeError(`${error.name}: ${error.message}`);
            }

            Atomics.store(threadMutexes, threadId, 1);
            Atomics.notify(threadMutexes, threadId, Infinity);
            break;
          }
        }
      });
    });

    Thread.terminate(thread);
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
        return { data: queryResult };
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
