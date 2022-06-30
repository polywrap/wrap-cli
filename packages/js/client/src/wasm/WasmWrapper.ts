/* eslint-disable @typescript-eslint/naming-convention */
import { WrapExports } from "./types";
import { createImports } from "./imports";

import {
  InvokeOptions,
  InvokeResult,
  InvocableResult,
  Wrapper,
  PolywrapManifest,
  Uri,
  Client,
  GetManifestOptions,
  deserializePolywrapManifest,
  deserializeBuildManifest,
  deserializeMetaManifest,
  AnyManifestArtifact,
  ManifestArtifactType,
  combinePaths,
  Env,
  UriResolverInterface,
  GetFileOptions,
  msgpackEncode,
  isBuffer,
} from "@polywrap/core-js";
import { Tracer } from "@polywrap/tracing-js";
import { AsyncWasmInstance } from "@polywrap/asyncify-js";

type InvokeResultOrError =
  | { type: "InvokeResult"; invokeResult: Uint8Array }
  | { type: "InvokeError"; invokeError: string };

const hasExport = (name: string, exports: Record<string, unknown>): boolean => {
  if (!exports[name]) {
    return false;
  }

  return true;
};

export interface State {
  method: string;
  args: Uint8Array;
  invoke: {
    result?: Uint8Array;
    error?: string;
  };
  subinvoke: {
    result?: Uint8Array;
    error?: string;
    args: unknown[];
  };
  subinvokeImplementation: {
    result?: Uint8Array;
    error?: string;
    args: unknown[];
  };
  invokeResult: InvokeResult;
  getImplementationsResult?: Uint8Array;
  sanitizeEnv: {
    args?: Uint8Array;
    result?: Uint8Array;
  };
  env?: Uint8Array;
}

export class WasmWrapper extends Wrapper {
  public static requiredExports: readonly string[] = ["_wrap_invoke"];

  private _schema?: string;
  private _wasm: Uint8Array | undefined = undefined;
  private _sanitizedEnv: Uint8Array | undefined = undefined;

  constructor(
    private _uri: Uri,
    private _manifest: PolywrapManifest,
    private _uriResolver: string,
    private _clientEnv?: Env<Uri>
  ) {
    super();

    Tracer.startSpan("WasmWrapper: constructor");
    Tracer.setAttribute("args", {
      uri: this._uri,
      manifest: this._manifest,
      clientEnv: this._clientEnv,
      uriResolver: this._uriResolver,
    });
    Tracer.endSpan();
  }

  @Tracer.traceMethod("WasmWrapper: getManifest")
  public async getManifest<TManifestArtifact extends ManifestArtifactType>(
    options: GetManifestOptions<TManifestArtifact>,
    client: Client
  ): Promise<AnyManifestArtifact<TManifestArtifact>> {
    if (!options?.type) {
      return this._manifest as AnyManifestArtifact<TManifestArtifact>;
    }
    let manifest: string | undefined;
    const fileTitle: string =
      options.type === "polywrap" ? "polywrap" : "polywrap." + options.type;

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
      throw new Error("WasmWrapper: Manifest was not found.");
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
        return deserializePolywrapManifest(
          manifest
        ) as AnyManifestArtifact<TManifestArtifact>;
    }
  }

  @Tracer.traceMethod("WasmWrapper: getFile")
  public async getFile(
    options: GetFileOptions,
    client: Client
  ): Promise<Uint8Array | string> {
    const { path, encoding } = options;
    const { data, error } = await UriResolverInterface.Query.getFile(
      {
        invoke: <TData = unknown, TUri extends Uri | string = string>(
          options: InvokeOptions<TUri>
        ): Promise<InvokeResult<TData>> => client.invoke<TData, TUri>(options),
      },
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
        `WasmWrapper: File was not found.\nURI: ${this._uri}\nSubpath: ${path}`
      );
    }

    if (encoding) {
      const decoder = new TextDecoder(encoding);
      const text = decoder.decode(data);

      if (!text) {
        throw Error(
          `WasmWrapper: Decoding the file's bytes array failed.\nBytes: ${data}`
        );
      }
      return text;
    }
    return data;
  }

  @Tracer.traceMethod("WasmWrapper: invoke")
  public async invoke(
    options: InvokeOptions<Uri>,
    client: Client
  ): Promise<InvocableResult<Uint8Array>> {
    try {
      const { method } = options;
      const args = options.args || {};
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
        args: isBuffer(args) ? args : msgpackEncode(args),
      };

      const abort = (message: string) => {
        throw new Error(
          `WasmWrapper: Wasm module aborted execution.\nURI: ${this._uri.uri}\n` +
            `Method: ${method}\n` +
            `Args: ${JSON.stringify(args, null, 2)}\nMessage: ${message}.\n`
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
        requiredExports: WasmWrapper.requiredExports,
      });

      const exports = instance.exports as WrapExports;

      await this._sanitizeAndLoadEnv(state, exports);

      const result = await exports._wrap_invoke(
        state.method.length,
        state.args.byteLength
      );

      const invokeResult = this._processInvokeResult(state, result, abort);

      switch (invokeResult.type) {
        case "InvokeError": {
          throw Error(
            `WasmWrapper: invocation exception encountered.\n` +
              `uri: ${this._uri.uri}\n` +
              `method: ${method}\n` +
              `args: ${JSON.stringify(args, null, 2)}\n` +
              `exception: ${invokeResult.invokeError}`
          );
        }
        case "InvokeResult": {
          return {
            data: invokeResult.invokeResult,
            encoded: true,
          };
        }
        default: {
          throw Error(`WasmWrapper: Unknown state "${state}"`);
        }
      }
    } catch (error) {
      return {
        error,
      };
    }
  }

  @Tracer.traceMethod("WasmWrapper: getSchema")
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

  @Tracer.traceMethod("WasmWrapper: _processInvokeResult")
  private _processInvokeResult(
    state: State,
    result: boolean,
    abort: (message: string) => never
  ): InvokeResultOrError {
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

  @Tracer.traceMethod("WasmWrapper: _sanitizeAndLoadEnv")
  private async _sanitizeAndLoadEnv(
    state: State,
    exports: WrapExports
  ): Promise<void> {
    if (hasExport("_wrap_load_env", exports)) {
      if (this._sanitizedEnv !== undefined) {
        state.env = this._sanitizedEnv;
      } else {
        const clientEnv = this._getClientEnv();

        if (hasExport("_wrap_sanitize_env", exports)) {
          state.sanitizeEnv.args = msgpackEncode({ env: clientEnv });

          await exports._wrap_sanitize_env(state.sanitizeEnv.args.byteLength);
          state.env = state.sanitizeEnv.result;
          this._sanitizedEnv = state.env;
        } else {
          state.env = msgpackEncode(clientEnv);
          this._sanitizedEnv = state.env;
        }
      }

      await exports._wrap_load_env(state.env?.byteLength || 0);
    }
  }

  @Tracer.traceMethod("WasmWrapper: _getClientEnv")
  private _getClientEnv(): Record<string, unknown> {
    if (!this._clientEnv?.env) {
      return {};
    }
    return this._clientEnv.env;
  }

  @Tracer.traceMethod("WasmWrapper: getWasmModule")
  private async _getWasmModule(client: Client): Promise<Uint8Array> {
    if (this._wasm !== undefined) {
      return this._wasm;
    }

    const moduleManifest = this._manifest.module;

    if (!moduleManifest) {
      throw Error(`Package manifest does not contain a definition for module`);
    }

    const data = (await this.getFile(
      { path: moduleManifest },
      client
    )) as Uint8Array;

    this._wasm = data;
    return data;
  }
}
