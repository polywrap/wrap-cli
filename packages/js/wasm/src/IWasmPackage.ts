import { GetManifestOptions, IWrapPackage } from "@polywrap/core-js";

export interface IWasmPackage extends IWrapPackage {
  getWasmModule(options: GetManifestOptions): Promise<ArrayBuffer>;
}
