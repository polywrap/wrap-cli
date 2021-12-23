/* eslint-disable @typescript-eslint/naming-convention */
import { W3Exports } from "./types";
import { createImports } from "./imports";

import {
  InvokeApiOptions,
  InvokeApiResult,
  Api,
  Web3ApiManifest,
  Uri,
  Client,
  InvokableModules,
  GetManifestOptions,
  deserializeWeb3ApiManifest,
  deserializeBuildManifest,
  deserializeMetaManifest,
  AnyManifest,
  ManifestType,
  combinePaths,
  Environment,
  UriResolver,
  GetFileOptions,
} from "@web3api/core-js";
import * as MsgPack from "@msgpack/msgpack";
import { Tracer } from "@web3api/tracing-js";
import { AsyncWasmInstance } from "@web3api/asyncify-js";

type InvokeResult =
  | { type: "InvokeResult"; invokeResult: ArrayBuffer }
  | { type: "InvokeError"; invokeError: string };

const hasExport = (name: string, exports: Record<string, unknown>): boolean => {
  if (!exports[name]) {
    return false;
  }

  return true;
};

export interface State {
  method: string;
  args: ArrayBuffer;
  invoke: {
    result?: ArrayBuffer;
    error?: string;
  };
  subinvoke: {
    result?: ArrayBuffer;
    error?: string;
    args: unknown[];
  };
  sanitizeEnv: {
    args?: ArrayBuffer;
    result?: ArrayBuffer;
  };
  invokeResult: InvokeResult;
  getImplementationsResult?: ArrayBuffer;
  environment?: ArrayBuffer;
}

export class WasmWeb3Api extends Api {
  public static requiredExports: readonly string[] = ["_w3_invoke"];

  private _schema?: string;

  private _wasm: {
    query?: ArrayBuffer;
    mutation?: ArrayBuffer;
  } = {};
  private _sanitizedEnviroment: {
    query?: ArrayBuffer;
    mutation?: ArrayBuffer;
  } = {};

  constructor(
    private _uri: Uri,
    private _manifest: Web3ApiManifest,
    private _uriResolver: Uri,
    private _module?: InvokableModules,
    private _clientEnvironment?: Environment<Uri>
  ) {
    super();

    Tracer.startSpan("WasmWeb3Api: constructor");
    Tracer.setAttribute("input", {
      uri: this._uri,
      manifest: this._manifest,
      clientEnviroment: this._clientEnvironment,
      uriResolver: this._uriResolver,
      module: this._module,
    });
    Tracer.endSpan();
  }

  @Tracer.traceMethod("WasmWeb3Api: getManifest")
  public async getManifest<TManifest extends ManifestType>(
    options: GetManifestOptions<TManifest>,
    client: Client
  ): Promise<AnyManifest<TManifest>> {
    if (!options?.type) {
      return this._manifest as AnyManifest<TManifest>;
    }
    let manifest: string;
    const fileTitle: string =
      options.type === "web3api" ? "web3api" : "web3api." + options.type;
    try {
      // try common yaml suffix
      const path: string = fileTitle + ".yaml";
      manifest = (await this.getFile(
        { path, encoding: "utf8" },
        client
      )) as string;
    } catch {
      // try alternate yaml suffix
      const path: string = fileTitle + ".yml";
      manifest = (await this.getFile(
        { path, encoding: "utf8" },
        client
      )) as string;
    }
    switch (options.type) {
      case "build":
        return deserializeBuildManifest(manifest) as AnyManifest<TManifest>;
      case "meta":
        return deserializeMetaManifest(manifest) as AnyManifest<TManifest>;
      default:
        return deserializeWeb3ApiManifest(manifest) as AnyManifest<TManifest>;
    }
  }

  @Tracer.traceMethod("WasmWeb3Api: getFile")
  public async getFile(
    options: GetFileOptions,
    client: Client
  ): Promise<ArrayBuffer | string> {
    const { path, encoding } = options;
    const { data, error } = await UriResolver.Query.getFile(
      <TData = unknown, TUri extends Uri | string = string>(
        options: InvokeApiOptions<TUri>
      ): Promise<InvokeApiResult<TData>> => client.invoke<TData, TUri>(options),
      this._uriResolver,
      combinePaths(this._uri.path, path)
    );

    if (error) {
      throw error;
    }

    // If nothing is returned, the file was not found
    if (!data) {
      throw Error(
        `WasmWeb3Api: File was not found.\nURI: ${this._uri}\nSubpath: ${path}`
      );
    }

    if (encoding) {
      const decoder = new TextDecoder(encoding);
      const text = decoder.decode(data);

      if (!text) {
        throw Error(
          `WasmWeb3Api: Decoding the file's bytes array failed.\nBytes: ${data}`
        );
      }
      return text;
    }
    return data;
  }

  @Tracer.traceMethod("WasmWeb3Api: invoke")
  public async invoke(
    options: InvokeApiOptions<Uri>,
    client: Client
  ): Promise<InvokeApiResult<unknown | ArrayBuffer>> {
    try {
      const { module: invokableModule, method, noDecode } = options;
      const input = options.input || {};
      const wasm = await this._getWasmModule(invokableModule, client);
      const state: State = {
        invoke: {},
        subinvoke: {
          args: [],
        },
        invokeResult: {} as InvokeResult,
        method,
        sanitizeEnv: {},
        args:
          input instanceof ArrayBuffer
            ? input
            : MsgPack.encode(input, { ignoreUndefined: true }),
      };

      const abort = (message: string) => {
        throw new Error(
          `WasmWeb3Api: Wasm module aborted execution.\nURI: ${this._uri.uri}\n` +
            `Module: ${invokableModule}\nMethod: ${method}\n` +
            `Input: ${JSON.stringify(input, null, 2)}\nMessage: ${message}.\n`
        );
      };

      const memory = AsyncWasmInstance.createMemory({ module: wasm });
      const instance = await AsyncWasmInstance.createInstance({
        module: wasm,
        imports: createImports({
          state,
          client,
          memory,
          abort,
        }),
        requiredExports: WasmWeb3Api.requiredExports,
      });

      const exports = instance.exports as W3Exports;

      await this._sanitizeAndLoadEnvironment(invokableModule, state, exports);

      const result = await exports._w3_invoke(
        state.method.length,
        state.args.byteLength
      );

      const invokeResult = this._processInvokeResult(state, result, abort);

      switch (invokeResult.type) {
        case "InvokeError": {
          throw Error(
            `WasmWeb3Api: invocation exception encountered.\n` +
              `uri: ${this._uri.uri}\nmodule: ${invokableModule}\n` +
              `method: ${method}\n` +
              `input: ${JSON.stringify(input, null, 2)}\n` +
              `exception: ${invokeResult.invokeError}`
          );
        }
        case "InvokeResult": {
          if (noDecode) {
            return {
              data: invokeResult.invokeResult,
            } as InvokeApiResult<ArrayBuffer>;
          }

          try {
            return {
              data: MsgPack.decode(invokeResult.invokeResult as ArrayBuffer),
            } as InvokeApiResult<unknown>;
          } catch (err) {
            throw Error(
              `WasmWeb3Api: Failed to decode query result.\nResult: ${JSON.stringify(
                invokeResult.invokeResult
              )}\nError: ${err}`
            );
          }
        }
        default: {
          throw Error(`WasmWeb3Api: Unknown state "${state}"`);
        }
      }
    } catch (error) {
      return {
        error,
      };
    }
  }

  @Tracer.traceMethod("WasmWeb3Api: getSchema")
  public async getSchema(client: Client): Promise<string> {
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

    this._schema = (await this.getFile(
      { path: module.schema, encoding: "utf8" },
      client
    )) as string;

    return this._schema;
  }

  @Tracer.traceMethod("WasmWeb3Api: processInvokeResult")
  private _processInvokeResult(
    state: State,
    result: boolean,
    abort: (message: string) => never
  ): InvokeResult {
    if (result) {
      if (!state.invoke.result) {
        abort("Invoke result is missing.");
      }

      return {
        type: "InvokeResult",
        invokeResult: state.invoke.result,
      };
    } else {
      if (!state.invoke.error) {
        abort("Invoke error is missing.");
      }

      return {
        type: "InvokeError",
        invokeError: state.invoke.error,
      };
    }
  }

  @Tracer.traceMethod("WasmWeb3Api: sanitizeAndLoadEnvironment")
  private async _sanitizeAndLoadEnvironment(
    module: InvokableModules,
    state: State,
    exports: W3Exports
  ): Promise<void> {
    if (hasExport("_w3_load_env", exports)) {
      if (this._sanitizedEnviroment[module] !== undefined) {
        state.environment = this._sanitizedEnviroment[module] as ArrayBuffer;
      } else {
        const clientEnvironment = this._getModuleClientEnvironment(module);
        if (hasExport("_w3_sanitize_env", exports)) {
          state.sanitizeEnv.args = MsgPack.encode(
            { env: clientEnvironment },
            { ignoreUndefined: true }
          );

          await exports._w3_sanitize_env(state.sanitizeEnv.args.byteLength);
          state.environment = state.sanitizeEnv.result as ArrayBuffer;
        } else {
          state.environment = MsgPack.encode(clientEnvironment, {
            ignoreUndefined: true,
          });
        }
      }

      await exports._w3_load_env(state.environment.byteLength);
    }
  }

  @Tracer.traceMethod("WasmWeb3Api: getModuleClientEnvironment")
  private _getModuleClientEnvironment(
    module: InvokableModules
  ): Record<string, unknown> {
    if (!this._clientEnvironment) {
      return {};
    }

    if (module === "query") {
      return {
        ...this._clientEnvironment.common,
        ...this._clientEnvironment.query,
      };
    } else {
      return {
        ...this._clientEnvironment.common,
        ...this._clientEnvironment.mutation,
      };
    }
  }

  @Tracer.traceMethod("WasmWeb3Api: getWasmModule")
  private async _getWasmModule(
    module: InvokableModules,
    client: Client
  ): Promise<ArrayBuffer> {
    if (this._wasm[module] !== undefined) {
      return this._wasm[module] as ArrayBuffer;
    }

    const moduleManifest = this._manifest.modules[module];

    if (!moduleManifest) {
      throw Error(
        `Package manifest does not contain a definition for module "${module}"`
      );
    }

    if (!moduleManifest.module) {
      throw Error(
        `Package manifest module ${module} does not contain a definition for module"`
      );
    }

    const data = (await this.getFile(
      { path: moduleManifest.module },
      client
    )) as ArrayBuffer;

    this._wasm[module] = data;
    return data;
  }
}
