/* eslint-disable @typescript-eslint/naming-convention */
import { WrapExports } from "./types";
import { createImports } from "./imports";
import { IFileReader } from "./IFileReader";
import { WRAP_MODULE_PATH } from "./constants";

import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { msgpackEncode } from "@polywrap/msgpack-js";
import { Tracer, TracingLevel } from "@polywrap/tracing-js";
import { AsyncWasmInstance } from "@polywrap/asyncify-js";
import {
  InvokeResult,
  Wrapper,
  Uri,
  InvokeOptions,
  Client,
  InvocableResult,
  isBuffer,
  GetFileOptions,
  GetManifestOptions,
} from "@polywrap/core-js";
import { WasmPackage } from "./WasmPackage";

type InvokeResultOrError =
  | { type: "InvokeResult"; invokeResult: Uint8Array }
  | { type: "InvokeError"; invokeError: string };

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
  env: Uint8Array;
}

const EMPTY_ENCODED_OBJECT = msgpackEncode({});

export class WasmWrapper implements Wrapper {
  public static requiredExports: readonly string[] = ["_wrap_invoke"];

  private _wasmModule?: Uint8Array;

  constructor(
    private _manifest: WrapManifest,
    private _fileReader: IFileReader
  ) {
    Tracer.startSpan("WasmWrapper: constructor");
    Tracer.setAttribute("args", {
      manifest: this._manifest,
      fileReader: this._fileReader,
    });
    Tracer.endSpan();
  }

  static async from(
    manifestBuffer: Uint8Array,
    wasmModule: Uint8Array,
    options?: GetManifestOptions
  ): Promise<WasmWrapper>;
  static async from(
    manifestBuffer: Uint8Array,
    wasmModule: Uint8Array,
    fileReader: IFileReader,
    options?: GetManifestOptions
  ): Promise<WasmWrapper>;
  static async from(
    manifestBuffer: Uint8Array,
    fileReader: IFileReader,
    options?: GetManifestOptions
  ): Promise<WasmWrapper>;
  static async from(
    fileReader: IFileReader,
    options?: GetManifestOptions
  ): Promise<WasmWrapper>;
  static async from(
    manifestBufferOrFileReader: Uint8Array | IFileReader,
    wasmModuleOrFileReaderOrManifestOptions?:
      | Uint8Array
      | IFileReader
      | GetManifestOptions,
    fileReaderOrManifestOptions?: IFileReader | GetManifestOptions,
    options?: GetManifestOptions
  ): Promise<WasmWrapper> {
    if (
      !wasmModuleOrFileReaderOrManifestOptions ||
      (wasmModuleOrFileReaderOrManifestOptions as GetManifestOptions)
        .noValidate === true ||
      (wasmModuleOrFileReaderOrManifestOptions as GetManifestOptions)
        .noValidate === false
    ) {
      return (await WasmPackage.from(manifestBufferOrFileReader).createWrapper(
        wasmModuleOrFileReaderOrManifestOptions as GetManifestOptions
      )) as WasmWrapper;
    } else if (
      !fileReaderOrManifestOptions ||
      (fileReaderOrManifestOptions as GetManifestOptions).noValidate === true ||
      (fileReaderOrManifestOptions as GetManifestOptions).noValidate === false
    ) {
      return (await WasmPackage.from(
        manifestBufferOrFileReader,
        wasmModuleOrFileReaderOrManifestOptions as Uint8Array | IFileReader
      ).createWrapper(
        fileReaderOrManifestOptions as GetManifestOptions
      )) as WasmWrapper;
    } else {
      return (await WasmPackage.from(
        manifestBufferOrFileReader,
        wasmModuleOrFileReaderOrManifestOptions as Uint8Array,
        fileReaderOrManifestOptions as IFileReader
      ).createWrapper(options)) as WasmWrapper;
    }
  }

  @Tracer.traceMethod("WasmWrapper: getFile")
  public async getFile(options: GetFileOptions): Promise<Uint8Array | string> {
    const { path, encoding } = options;

    const data = await this._fileReader.readFile(path);

    // If nothing is returned, the file was not found
    if (!data) {
      throw Error(`WasmWrapper: File was not found.\nSubpath: ${path}`);
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

  @Tracer.traceMethod("WasmWrapper: getManifest")
  public async getManifest(): Promise<WrapManifest> {
    return this._manifest;
  }

  @Tracer.traceMethod("WasmWrapper: invoke", TracingLevel.High)
  public async invoke(
    options: InvokeOptions<Uri>,
    client: Client
  ): Promise<InvocableResult<Uint8Array>> {
    Tracer.setAttribute(
      "label",
      `WASM Wrapper invoked: ${options.uri.uri}, with method ${options.method}`,
      TracingLevel.High
    );
    try {
      const { method } = options;
      const args = options.args || {};
      const wasm = await this._getWasmModule();

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
        args: args
          ? isBuffer(args)
            ? args
            : msgpackEncode(args)
          : EMPTY_ENCODED_OBJECT,
        env: options.env ? msgpackEncode(options.env) : EMPTY_ENCODED_OBJECT,
      };

      const abort = (message: string) => {
        throw new Error(
          `WasmWrapper: Wasm module aborted execution.\nURI: ${options.uri.uri}\n` +
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

      const result = await exports._wrap_invoke(
        state.method.length,
        state.args.byteLength,
        state.env.byteLength
      );

      const invokeResult = this._processInvokeResult(state, result, abort);

      switch (invokeResult.type) {
        case "InvokeError": {
          throw Error(
            `WasmWrapper: invocation exception encountered.\n` +
              `uri: ${options.uri.uri}\n` +
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

  @Tracer.traceMethod("WasmWrapper: getWasmModule")
  private async _getWasmModule(): Promise<Uint8Array> {
    if (this._wasmModule === undefined) {
      this._wasmModule = await this._fileReader.readFile(WRAP_MODULE_PATH);

      if (!this._wasmModule) {
        throw Error(`Wrapper does not contain a wasm module`);
      }
    }

    return this._wasmModule;
  }
}
