import { IFileReader } from "./IFileReader";
import { IWasmPackage } from "./IWasmPackage";
import { WasmWrapper } from "./WasmWrapper";
import { WRAP_MODULE_PATH, WRAP_MANIFEST_PATH } from "./constants";
import { InMemoryFileReader } from "./InMemoryFileReader";

import {
  deserializeWrapManifest,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import { GetManifestOptions } from "@polywrap/core-js";

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
    wasmModuleOrFileReader?: Uint8Array | IFileReader,
    fileReader?: IFileReader
  ): WasmPackage;
  static from(
    manifestBufferOrFileReader: Uint8Array | IFileReader,
    wasmModuleOrFileReader?: Uint8Array | IFileReader,
    fileReader?: IFileReader
  ): WasmPackage {
    let manifestBuffer: Uint8Array | undefined;
    let wasmModule: Uint8Array | undefined;
    let builtFileReader: IFileReader | undefined = fileReader;

    if (manifestBufferOrFileReader instanceof Uint8Array) {
      manifestBuffer = manifestBufferOrFileReader as Uint8Array;
    } else {
      builtFileReader = manifestBufferOrFileReader as IFileReader;
    }

    if (wasmModuleOrFileReader) {
      if (wasmModuleOrFileReader instanceof Uint8Array) {
        wasmModule = wasmModuleOrFileReader as Uint8Array;
      } else if ((wasmModuleOrFileReader as Partial<IFileReader>).readFile) {
        builtFileReader = wasmModuleOrFileReader as IFileReader;
      }
    }

    if (manifestBuffer) {
      if (wasmModule) {
        return new WasmPackage(
          InMemoryFileReader.from(
            manifestBuffer,
            wasmModule,
            builtFileReader as IFileReader
          )
        );
      } else {
        return new WasmPackage(
          InMemoryFileReader.fromManifest(
            manifestBuffer,
            builtFileReader as IFileReader
          )
        );
      }
    } else {
      return new WasmPackage(builtFileReader as IFileReader);
    }
  }

  async getManifest(options?: GetManifestOptions): Promise<WrapManifest> {
    const wrapManifest = await this.fileReader.readFile(WRAP_MANIFEST_PATH);

    if (!wrapManifest) {
      throw Error(`WRAP manifest not found`);
    }

    return deserializeWrapManifest(wrapManifest, options);
  }

  async getWasmModule(): Promise<Uint8Array> {
    const wasmModule = await this.fileReader.readFile(WRAP_MODULE_PATH);

    if (!wasmModule) {
      throw Error(`Wrapper does not contain a wasm module`);
    }

    return wasmModule;
  }

  async createWrapper(options?: GetManifestOptions): Promise<WasmWrapper> {
    const manifest = await this.getManifest(options);

    return new WasmWrapper(manifest, this.fileReader);
  }
}
