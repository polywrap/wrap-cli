import { IFileReader } from "./IFileReader";
import { IWasmPackage } from "./IWasmPackage";
import { WasmWrapper } from "./WasmWrapper";
import { WRAP_MODULE_PATH, WRAP_MANIFEST_PATH } from "./constants";
import { InMemoryFileReader } from "./InMemoryFileReader";

import {
  deserializeWrapManifest,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import { Client, GetManifestOptions, Uri, Wrapper } from "@polywrap/core-js";

export class WasmPackage implements IWasmPackage {
  protected constructor(
    public readonly uri: Uri,
    private readonly fileReader: IFileReader
  ) {}

  static from(
    uri: Uri,
    manifestBuffer: Uint8Array,
    wasmModule: Uint8Array
  ): WasmPackage;
  static from(
    uri: Uri,
    manifestBuffer: Uint8Array,
    wasmModule: Uint8Array,
    fileReader: IFileReader
  ): WasmPackage;
  static from(
    uri: Uri,
    manifestBuffer: Uint8Array,
    fileReader: IFileReader
  ): WasmPackage;
  static from(uri: Uri, fileReader: IFileReader): WasmPackage;
  static from(
    uri: Uri,
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
          uri,
          InMemoryFileReader.from(
            manifestBuffer,
            wasmModule,
            fileReader as IFileReader
          )
        );
      } else {
        return new WasmPackage(
          uri,
          InMemoryFileReader.fromManifest(
            manifestBuffer,
            fileReader as IFileReader
          )
        );
      }
    } else {
      return new WasmPackage(uri, fileReader as IFileReader);
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

  async createWrapper(
    _: Client,
    resolutionPath: Uri[],
    options?: GetManifestOptions
  ): Promise<Wrapper> {
    const manifest = await this.getManifest(options);

    return new WasmWrapper(this.uri, resolutionPath, manifest, this.fileReader);
  }
}
