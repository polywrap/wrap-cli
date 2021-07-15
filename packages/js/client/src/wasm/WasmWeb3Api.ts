/* eslint-disable @typescript-eslint/naming-convention */
import { createImports } from "./imports";
import { AsyncWASMInstance } from "./asyncify";

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

type InvokeResult =
  | { type: "Abort"; message: string }
  | { type: "InvokeResult"; invokeResult: ArrayBuffer }
  | { type: "InvokeError"; invokeError: string };

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[];
  };
  invokeResult: InvokeResult;
}

const processInvokeResult = (state: State, result: boolean): InvokeResult => {
  if (result) {
    if (!state.invoke.result) {
      return {
        type: "Abort",
        message: "Invoke result is missing.",
      };
    }

    return {
      type: "InvokeResult",
      invokeResult: state.invoke.result,
    };
  } else {
    if (!state.invoke.error) {
      return {
        type: "Abort",
        message: "Invoke error is missing.",
      };
    }

    return {
      type: "InvokeError",
      invokeError: state.invoke.error,
    };
  }
};

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
        const state: State = {
          invoke: {},
          subinvoke: {
            args: [],
          },
          invokeResult: {} as InvokeResult,
          method,
          args:
            input instanceof ArrayBuffer
              ? input
              : MsgPack.encode(input, { ignoreUndefined: true }),
        };

        const module = new WebAssembly.Module(wasm);
        const memory = new WebAssembly.Memory({ initial: 1 });
        const instance = new AsyncWASMInstance({
          module,
          imports: createImports({
            state,
            client,
            memory,
          }),
          requiredExports: ["_w3_init", "_w3_invoke"],
        });

        const exports = instance.exports;

        exports._w3_init();

        const result = await exports._w3_invoke(
          state.method.length,
          state.args.byteLength
        );

        const invokeResult = processInvokeResult(state, result);

        switch (invokeResult.type) {
          case "Abort":
            return {
              error: new Error(
                `WasmWeb3Api: Thread aborted execution.\nURI: ${this._uri.uri}\n` +
                  `Module: ${module}\nMethod: ${method}\n` +
                  `Input: ${JSON.stringify(input, null, 2)}\nMessage: ${
                    invokeResult.message
                  }\n`
              ),
            };
          case "InvokeError": {
            return {
              error: new Error(
                `WasmWeb3Api: invocation exception encountered.\n` +
                  `uri: ${this._uri.uri}\nmodule: ${module}\n` +
                  `method: ${method}\n` +
                  `input: ${JSON.stringify(input, null, 2)}\n` +
                  `exception: ${invokeResult.invokeError}`
              ),
            };
          }
          case "InvokeResult": {
            if (decode) {
              try {
                return {
                  data: MsgPack.decode(
                    invokeResult.invokeResult as ArrayBuffer
                  ),
                };
              } catch (err) {
                throw Error(
                  `WasmWeb3Api: Failed to decode query result.\nResult: ${JSON.stringify(
                    invokeResult.invokeResult
                  )}\nError: ${err}`
                );
              }
            } else {
              return { data: invokeResult.invokeResult };
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
