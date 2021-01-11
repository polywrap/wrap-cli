import {
  ThreadState,
  ThreadMethods
} from "./Thread";

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

  public async invoke<
    TData = unknown
  >(
    options: InvokeApiOptions,
    client: Client
  ): Promise<InvokeApiResult<TData>> {
    const { module, method, input } = options;

    // Fetch the schema
    const schema = await this.getSchema(client);

    // Get the schema's type info
    const typeInfo = this.getTypeInfo(schema);

    const root: "Query" | "Mutation" =
      module === "query" ? "Query" : "Mutation";

    // Ensure the schema contains the query module being asked for
    const queryIdx = typeInfo.queryTypes.findIndex(
      (item: QueryDefinition) => item.name === root
    );

    if (queryIdx === -1) {
      throw Error(`Unable to find query type by the name of "${root}".`);
    }

    const queryInfo = typeInfo.queryTypes[queryIdx];

    // Ensure the query module contains the method being asked for
    const methodIdx = queryInfo.methods.findIndex(
      (item: MethodDefinition) => item.name === method
    );

    if (methodIdx === -1) {
      throw Error(`Unable to find method "${method}" on query type "${root}".`);
    }

    // We use this method type for serializing the arguments,
    // and deserializing the return value
    const methodInfo = queryInfo.methods[methodIdx];

    // Fetch the WASM module
    const wasm = await this.getWasmModule(module, client);

    // TODO: use a pool of workers
    // TODO: use transferable buffers

    const thread = await spawn<ThreadMethods>(
      new Worker("./WasmThread")
    );

    const state = await thread.start(
      wasm, method, input, methodInfo
    );

    Thread.terminate(thread);

    // TODO:
    // x fetch schema
    // x parse schema
    // x module (caps) has method
    // x fetch module (mutation or query)
    ///// in other thread /////
    // - get argument types
    // - serialize input to msgpack
    // - exec method on module w/ input arguments in worker
    // - deserialize arguments
    /////
    // - return result
  }

  private async getSchema(client: Client): Promise<string> {
    if (this._schema) {
      return this._schema;
    }

    const { data, errors } = await ApiResolver.Query.getFile(
      client,
      this._apiResolver,
      `${this._uri.uri}/${this._manifest.schema.file}`
    );

    if (errors?.length) {
      throw errors;
    }

    // If nothing is returned, the schema was not found
    if (!data) {
      throw Error(
        `Schema was not found.\nURI: ${this._uri}\nSubpath: ${this._manifest.schema.file}`
      );
    }

    this._schema = String.fromCharCode.apply(null, data);

    if (!this._schema) {
      throw Error(
        `Decoding the schema's bytes array failed.\nBytes: ${data}`
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

    const { data, errors } = await ApiResolver.Query.getFile(
      client,
      this._apiResolver,
      `${this._uri}/${moduleManifest.module.file}`
    );

    if (errors?.length) {
      throw errors;
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
