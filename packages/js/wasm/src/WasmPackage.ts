import { IFileReader } from "./IFileReader";
import { IWasmPackage } from "./IWasmPackage";
import { WasmWrapper } from "./WasmWrapper";

import {
  deserializeWrapManifest,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import {
  Client,
  GetManifestOptions,
  Uri,
  Wrapper,
  getEnvFromUriHistory,
} from "@polywrap/core-js";

export class WasmPackage implements IWasmPackage {
  constructor(
    public readonly uri: Uri,
    public readonly fileReader: IFileReader,
    private manifest?: WrapManifest
  ) {}

  async getManifest(options?: GetManifestOptions): Promise<WrapManifest> {
    const wrapManifestPath = "wrap.wasm";

    const wrapManifest = await this.fileReader.getFile(wrapManifestPath);

    if (!wrapManifest) {
      throw Error(`Package manifest not found`);
    }

    return deserializeWrapManifest(wrapManifest, options);
  }

  async getWasmModule(): Promise<Uint8Array> {
    const wrapModulePath = "wrap.wasm";

    const wasmModule = await this.fileReader.getFile(wrapModulePath);

    if (!wasmModule) {
      throw Error(`Wrapper does not contain a wasm module`);
    }

    return wasmModule;
  }

  async createWrapper(client: Client, uriHistory: Uri[]): Promise<Wrapper> {
    const manifest = this.manifest ?? (await this.getManifest());
    const env = getEnvFromUriHistory(uriHistory, client);

    return new WasmWrapper(this.uri, manifest, this.fileReader, env);
  }
}
