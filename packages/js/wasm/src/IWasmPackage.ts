import { IFileReader } from "./IFileReader";

import { IWrapPackage } from "@polywrap/core-js";

export interface IWasmPackage extends IWrapPackage {
  fileReader: IFileReader;
  getWasmModule(): Promise<Uint8Array>;
}
