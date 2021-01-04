import { ExecuteOptions, ExecuteResult, Web3Api, Manifest } from "./";
import { Uri } from "../Uri";
import { Web3ApiClient } from "../Web3ApiClient";

import { parseSchema, TypeInfo, QueryDefinition, MethodDefinition } from "@web3api/schema-parse";
import { TypeInfo, TypeInfo } from "graphql";

export class WasmWeb3Api extends Web3Api {
  private _schema?: string;
  private _typeInfo?: TypeInfo;

  private _wasm: {
    query?: ArrayBuffer;
    mutation?: ArrayBuffer;
  } = {};

  constructor(uri: Uri, private _manifest: Manifest, private _resolver: string) {
    super(uri);
  }

  public async execute(options: ExecuteOptions, client: Web3ApiClient): Promise<ExecuteResult> {
    const { module, method } = options;

    // Fetch the schema
    const schema = await this.getSchema(client);

    // Get the schema's type info
    const typeInfo = this.getTypeInfo(schema);

    const root: "Query" | "Mutation" = module === "query" ? "Query" : "Mutation";

    // Ensure the schema contains the method being asked for
    const queryIdx = typeInfo.queryTypes.findIndex((item: QueryDefinition) => item.name === root);

    if (queryIdx === -1) {
      throw Error(`Unable to find query type by the name of "${root}".`);
    }

    const queryInfo = typeInfo.queryTypes[queryIdx];
    const methodIdx = queryInfo.methods.findIndex((item: MethodDefinition) => item.name === method);

    if (methodIdx === -1) {
      throw Error(`Unable to find method "${method}" on query type "${root}".`);
    }

    // We use this method type for serializing the arguments,
    // and deserializing the return value
    const _methodInfo = queryInfo.methods[methodIdx];

    // Fetch the WASM module
    const _wasm = this.getWasmModule(module, client);

    // ...

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

  private async getSchema(client: Web3ApiClient): Promise<string> {
    if (this._schema) {
      return this._schema;
    }

    const { data, errors } = await client.query<getFile.Result>({
      uri: this._resolver,
      query: getFile.query(`${this._uri}/${this._manifest.schema.file}`),
    });

    if (errors?.length) {
      throw errors;
    }

    // If nothing is returned, the schema was not found
    if (!data || !data.bytes) {
      throw Error(`Schema was not found.\nURI: ${this._uri}\nSubpath: ${this._manifest.schema.file}`);
    }

    this._schema = String.fromCharCode.apply(null, data.bytes);

    if (!this._schema) {
      throw Error(`Decoding the schema's bytes array failed.\nBytes: ${data.bytes}`);
    }

    return this._schema;
  }

  private getTypeInfo(schema: string): TypeInfo {
    if (!this._typeInfo) {
      this._typeInfo = parseSchema(schema);
    }

    return this._typeInfo;
  }

  private async getWasmModule(module: "query" | "mutation", client: Web3ApiClient): Promise<ArrayBuffer> {
    if (this._wasm[module] !== undefined) {
      return this._wasm[module];
    }

    const moduleManifest = this._manifest[module];

    if (!moduleManifest) {
      throw Error(`Package manifest does not contain a definition for module "${module}"`);
    }

    const { data, errors } = await client.query<getFile.Result>({
      uri: this._resolver,
      query: getFile.query(`${this._uri}/${moduleManifest.module.file}`),
    });

    if (errors?.length) {
      throw errors;
    }

    // If nothing is returned, the module was not found
    if (!data || !data.bytes) {
      throw Error(`Module was not found.\nURI: ${this._uri}\nSubpath: ${moduleManifest.module.file}`);
    }

    return data.bytes;
  }
}
