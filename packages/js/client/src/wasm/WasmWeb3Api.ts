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
  GetManifestOptions,
  deserializeWeb3ApiManifest,
  deserializeBuildManifest,
  deserializeMetaManifest,
  AnyManifestArtifact,
  ManifestArtifactType,
  combinePaths,
  Env,
  UriResolverInterface,
  GetFileOptions,
  msgpackEncode,
  msgpackDecode,
} from "@web3api/core-js";
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
  subinvokeImplementation: {
    result?: ArrayBuffer;
    error?: string;
    args: unknown[];
  };
  invokeResult: InvokeResult;
  getImplementationsResult?: ArrayBuffer;
  sanitizeEnv: {
    args?: ArrayBuffer;
    result?: ArrayBuffer;
  };
  env?: ArrayBuffer;
}

export class WasmWeb3Api extends Api {
  public static requiredExports: readonly string[] = ["_w3_invoke"];

  private _schema?: string;
  private _wasm: ArrayBuffer | undefined = undefined;
  private _sanitizedEnv: ArrayBuffer | undefined = undefined;

  constructor(
    private _uri: Uri,
    private _manifest: Web3ApiManifest,
    private _uriResolver: string,
    private _clientEnv?: Env<Uri>
  ) {
    super();

    Tracer.startSpan("WasmWeb3Api: constructor");
    Tracer.setAttribute("input", {
      uri: this._uri,
      manifest: this._manifest,
      clientEnv: this._clientEnv,
      uriResolver: this._uriResolver,
    });
    Tracer.endSpan();
  }

  @Tracer.traceMethod("WasmWeb3Api: getManifest")
  public async getManifest<TManifestArtifact extends ManifestArtifactType>(
    options: GetManifestOptions<TManifestArtifact>,
    client: Client
  ): Promise<AnyManifestArtifact<TManifestArtifact>> {
    if (!options?.type) {
      return this._manifest as AnyManifestArtifact<TManifestArtifact>;
    }
    let manifest: string | undefined;
    const fileTitle: string =
      options.type === "web3api" ? "web3api" : "web3api." + options.type;

    const manifestExts = ["json", "yaml", "yml"];
    for (const ext of manifestExts) {
      const path = `${fileTitle}.${ext}`;
      try {
        manifest = (await this.getFile(
          { path, encoding: "utf8" },
          client
        )) as string;
        break;
      } catch (error) {
        continue;
      }
    }
    if (!manifest) {
      throw new Error("WasmWeb3Api: Manifest was not found.");
    }
    switch (options.type) {
      case "build":
        return deserializeBuildManifest(
          manifest
        ) as AnyManifestArtifact<TManifestArtifact>;
      case "meta":
        return deserializeMetaManifest(
          manifest
        ) as AnyManifestArtifact<TManifestArtifact>;
      default:
        return deserializeWeb3ApiManifest(
          manifest
        ) as AnyManifestArtifact<TManifestArtifact>;
    }
  }

  @Tracer.traceMethod("WasmWeb3Api: getFile")
  public async getFile(
    options: GetFileOptions,
    client: Client
  ): Promise<ArrayBuffer | string> {
    const { path, encoding } = options;
    const { data, error } = await UriResolverInterface.Query.getFile(
      <TData = unknown, TUri extends Uri | string = string>(
        options: InvokeApiOptions<TUri>
      ): Promise<InvokeApiResult<TData>> => client.invoke<TData, TUri>(options),
      // TODO: support all types of URI resolvers (cache, etc)
      new Uri(this._uriResolver),
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
      const { method, noDecode } = options;
      const input = options.input || {};
      const wasm = await this._getWasmModule(client);

      const state: State = {
        invoke: {},
        subinvoke: {
          args: [],
        },
        subinvokeImplementation: {
          args: [],
        },
        invokeResult: {} as InvokeResult,
        method,
        sanitizeEnv: {},
        args: input instanceof ArrayBuffer ? input : msgpackEncode(input),
      };

      const abort = (message: string) => {
        throw new Error(
          `WasmWeb3Api: Wasm module aborted execution.\nURI: ${this._uri.uri}\n` +
            `Method: ${method}\n` +
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

      await this._sanitizeAndLoadEnv(state, exports);

      const result = await exports._w3_invoke(
        state.method.length,
        state.args.byteLength
      );

      const invokeResult = this._processInvokeResult(state, result, abort);

      switch (invokeResult.type) {
        case "InvokeError": {
          throw Error(
            `WasmWeb3Api: invocation exception encountered.\n` +
              `uri: ${this._uri.uri}\n` +
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
              data: msgpackDecode(invokeResult.invokeResult as ArrayBuffer),
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
    const schema = this._manifest.schema;
    this._schema = (await this.getFile(
      { path: schema, encoding: "utf8" },
      client
    )) as string;

    return this._schema;
  }

  @Tracer.traceMethod("WasmWeb3Api: _processInvokeResult")
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

  @Tracer.traceMethod("WasmWeb3Api: _sanitizeAndLoadEnv")
  private async _sanitizeAndLoadEnv(
    state: State,
    exports: W3Exports
  ): Promise<void> {
    if (hasExport("_w3_load_env", exports)) {
      if (this._sanitizedEnv !== undefined) {
        state.env = this._sanitizedEnv as ArrayBuffer;
      } else {
        const clientEnv = this._getModuleClientEnv();

        if (hasExport("_w3_sanitize_env", exports)) {
          state.sanitizeEnv.args = msgpackEncode({ env: clientEnv });

          await exports._w3_sanitize_env(state.sanitizeEnv.args.byteLength);
          state.env = state.sanitizeEnv.result as ArrayBuffer;
          this._sanitizedEnv = state.env;
        } else {
          state.env = msgpackEncode(clientEnv);
          this._sanitizedEnv = state.env;
        }
      }

      await exports._w3_load_env(state.env.byteLength);
    }
  }

  @Tracer.traceMethod("WasmWeb3Api: _getModuleClientEnv")
  private _getModuleClientEnv(): Record<string, unknown> {
    if (!this._clientEnv?.module) {
      return {};
    }
    return this._clientEnv.module;
  }

  @Tracer.traceMethod("WasmWeb3Api: getWasmModule")
  private async _getWasmModule(client: Client): Promise<ArrayBuffer> {
    if (this._wasm !== undefined) {
      return this._wasm as ArrayBuffer;
    }

    const moduleManifest = this._manifest.main;

    if (!moduleManifest) {
      throw Error(`Package manifest does not contain a definition for module`);
    }

    const data = (await this.getFile(
      { path: moduleManifest },
      client
    )) as ArrayBuffer;

    this._wasm = data;
    return data;
  }
}
