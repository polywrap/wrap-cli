import { IWrapPackage } from "@polywrap/core-js";
import { IFileReader } from "./IFileReader";

export interface IWasmPackage extends IWrapPackage {
  fileReader: IFileReader;
  getWasmModule(): Promise<Uint8Array>;
}
