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
  ApiResolver,
  InvokableModules,
} from "@web3api/core-js";
import * as MsgPack from "@msgpack/msgpack";
import { Tracer } from "@web3api/tracing-js";

export interface State {
  method?: string;
  args?: ArrayBuffer;
  invoke: {
    result?: ArrayBuffer;
    error?: string;
  };
  subinvoke: {
    result?: ArrayBuffer;
    error?: string;
  };
}

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
        const wasm = await this.getWasmModule(invokableModule, client);

        let abortMessage: string | undefined;
        let queryResult: ArrayBuffer | undefined;
        let queryError: string | undefined;

        const args =
          input instanceof ArrayBuffer
            ? input
            : MsgPack.encode(input, { ignoreUndefined: true });
        const module = new WebAssembly.Module(wasm);
        const memory = new WebAssembly.Memory({ initial: 1 });
        const state: State = {
          invoke: {},
          subinvoke: {},
        };

        const source: WebAssembly.Instance = new WebAssembly.Instance(
          module,
          createImports({
            args,
            getModule: () => source,
            state,
            client,
            memory,
          })
        );

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
          queryResult = state.invoke.result;
          state = "LogQueryResult";
        } else {
          if (!state.invoke.error) {
            abortMessage = `Invoke error is missing.`;
            state = "Abort";
            return;
          }

          // __w3_invoke_error has already been called
          queryError = state.invoke.error;
          state = "LogQueryError";
        }

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
