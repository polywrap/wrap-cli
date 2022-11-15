/* eslint-disable @typescript-eslint/naming-convention */
import { WrapExports } from "./types";
import { createImports } from "./imports";
import { IFileReader } from "./IFileReader";
import { WRAP_MODULE_PATH } from "./constants";
import { createWasmWrapper } from "./helpers/createWasmWrapper";

import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { msgpackEncode } from "@polywrap/msgpack-js";
import { Tracer, TracingLevel } from "@polywrap/tracing-js";
import { AsyncWasmInstance } from "@polywrap/asyncify-js";
import {
  CoreClient,
  GetFileOptions,
  GetManifestOptions,
  InvocableResult,
  InvokeOptions,
  isBuffer,
  Uri,
  Wrapper,
  InvokeError,
  InvokeErrorCode,
  WasmErrorSource,
} from "@polywrap/core-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

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
  invokeResult?: Result<unknown>;
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
    manifestOptions?: GetManifestOptions
  ): Promise<WasmWrapper> {
    return createWasmWrapper(
      manifestBufferOrFileReader,
      wasmModuleOrFileReaderOrManifestOptions,
      fileReaderOrManifestOptions,
      manifestOptions
    );
  }

  @Tracer.traceMethod("WasmWrapper: getFile")
  public async getFile(
    options: GetFileOptions
  ): Promise<Result<Uint8Array | string, Error>> {
    const { path, encoding } = options;

    const dataResult = await this._fileReader.readFile(path);

    // If nothing is returned, the file was not found
    if (!dataResult.ok) {
      return ResultErr(
        Error(`WasmWrapper: File was not found.\nSubpath: ${path}`)
      );
    }

    const data = dataResult.value;

    if (encoding) {
      const decoder = new TextDecoder(encoding);
      const text = decoder.decode(data);

      if (!text) {
        const error = Error(
          `WasmWrapper: Decoding the file's bytes array failed.\nBytes: ${data}`
        );
        return ResultErr(error);
      }
      return ResultOk(text);
    }
    return ResultOk(data);
  }

  @Tracer.traceMethod("WasmWrapper: getManifest")
  public getManifest(): WrapManifest {
    return this._manifest;
  }

  @Tracer.traceMethod("WasmWrapper: invoke", TracingLevel.High)
  public async invoke(
    options: InvokeOptions<Uri>,
    client: CoreClient
  ): Promise<InvocableResult<Uint8Array>> {
    Tracer.setAttribute(
      "label",
      `WASM Wrapper invoked: ${options.uri.uri}, with method ${options.method}`,
      TracingLevel.High
    );
    try {
      const { method } = options;
      const args = options.args || {};
      const wasmResult = await this._getWasmModule();
      if (!wasmResult.ok) {
        return wasmResult;
      }
      const wasm = wasmResult.value;

      const state: State = {
        invoke: {},
        subinvoke: {
          args: [],
        },
        subinvokeImplementation: {
          args: [],
        },
        method,
        args: args
          ? isBuffer(args)
            ? args
            : msgpackEncode(args)
          : EMPTY_ENCODED_OBJECT,
        env: options.env ? msgpackEncode(options.env) : EMPTY_ENCODED_OBJECT,
      };

      const abort = (message: string, source?: WasmErrorSource) => {
        throw new InvokeError(message, {
          code: InvokeErrorCode.ABORTED,
          uri: options.uri.uri,
          method,
          args: JSON.stringify(args, null, 2),
          source,
        });
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

      if (invokeResult.ok) {
        return {
          ...invokeResult,
          encoded: true,
        };
      } else {
        const error = new InvokeError(invokeResult.error?.message ?? "", {
          code: InvokeErrorCode.RETURNED,
          uri: options.uri.uri,
          method,
          args: JSON.stringify(args, null, 2),
          cause: invokeResult.error,
        });
        return ResultErr(error);
      }
    } catch (error) {
      return ResultErr(error);
    }
  }

  @Tracer.traceMethod("WasmWrapper: _processInvokeResult")
  private _processInvokeResult(
    state: State,
    result: boolean,
    abort: (message: string) => never
  ): Result<Uint8Array, Error> {
    if (result) {
      if (!state.invoke.result) {
        abort("Invoke result is missing.");
      }

      return ResultOk(state.invoke.result);
    } else {
      if (!state.invoke.error) {
        abort("Invoke error is missing.");
      }

      return ResultErr(Error(state.invoke.error));
    }
  }

  @Tracer.traceMethod("WasmWrapper: getWasmModule")
  private async _getWasmModule(): Promise<Result<Uint8Array, Error>> {
    if (this._wasmModule === undefined) {
      const result = await this._fileReader.readFile(WRAP_MODULE_PATH);

      if (!result.ok) {
        return ResultErr(Error(`Wrapper does not contain a wasm module`));
      }

      this._wasmModule = result.value;
    }

    return ResultOk(this._wasmModule);
  }
}
