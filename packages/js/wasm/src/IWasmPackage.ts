import { IWrapPackage } from "@polywrap/core-js";

export interface IWasmPackage extends IWrapPackage {
  getWasmModule(): Promise<Uint8Array>;
}
