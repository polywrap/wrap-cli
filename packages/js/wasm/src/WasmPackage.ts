import { IFileReader } from "./IFileReader";
import { IWasmPackage } from "./IWasmPackage";
import { WasmWrapper } from "./WasmWrapper";
import { WRAP_MODULE_PATH, WRAP_MANIFEST_PATH } from "./constants";
import { InMemoryFileReader } from "./InMemoryFileReader";

import {
  deserializeWrapManifest,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import { GetManifestOptions, Wrapper } from "@polywrap/core-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export class WasmPackage implements IWasmPackage {
  protected constructor(private readonly fileReader: IFileReader) {}

  static from(manifestBuffer: Uint8Array, wasmModule: Uint8Array): WasmPackage;
  static from(
    manifestBuffer: Uint8Array,
    wasmModule: Uint8Array,
    fileReader: IFileReader
  ): WasmPackage;
  static from(manifestBuffer: Uint8Array, fileReader: IFileReader): WasmPackage;
  static from(fileReader: IFileReader): WasmPackage;
  static from(
    manifestBufferOrFileReader: Uint8Array | IFileReader,
    wasmModuleOrFileReader?: Uint8Array | IFileReader
  ): WasmPackage {
    let manifestBuffer: Uint8Array | undefined;
    let wasmModule: Uint8Array | undefined;
    let fileReader: IFileReader | undefined;

    if (Array.isArray(manifestBufferOrFileReader)) {
      manifestBuffer = manifestBufferOrFileReader as Uint8Array;
    } else {
      fileReader = manifestBufferOrFileReader as IFileReader;
    }

    if (Array.isArray(wasmModuleOrFileReader)) {
      wasmModule = wasmModuleOrFileReader as Uint8Array;
    } else if ((wasmModuleOrFileReader as Partial<IFileReader>).readFile) {
      fileReader = wasmModuleOrFileReader as IFileReader;
    }

    if (manifestBuffer) {
      if (wasmModule) {
        return new WasmPackage(
          InMemoryFileReader.from(
            manifestBuffer,
            wasmModule,
            fileReader as IFileReader
          )
        );
      } else {
        return new WasmPackage(
          InMemoryFileReader.fromManifest(
            manifestBuffer,
            fileReader as IFileReader
          )
        );
      }
    } else {
      return new WasmPackage(fileReader as IFileReader);
    }
  }

  // TODO: return Result
  async getManifest(
    options?: GetManifestOptions
  ): Promise<Result<WrapManifest, Error>> {
    const result = await this.fileReader.readFile(WRAP_MANIFEST_PATH);

    if (!result.ok) {
      return result;
    }

    const wrapManifest = result.value;
    return ResultOk(await deserializeWrapManifest(wrapManifest, options));
  }

  async getWasmModule(): Promise<Result<Uint8Array, Error>> {
    const result = await this.fileReader.readFile(WRAP_MODULE_PATH);

    if (!result.ok) {
      return ResultErr(Error(`Wrapper does not contain a wasm module`));
    }

    return result;
  }

  async createWrapper(
    options?: GetManifestOptions
  ): Promise<Result<Wrapper, Error>> {
    const result = await this.getManifest(options);

    if (!result.ok) {
      return result;
    }

    return ResultOk(new WasmWrapper(result.value, this.fileReader));
  }
}
