import { IWrapPackage } from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export interface IWasmPackage extends IWrapPackage {
  getWasmModule(): Promise<Result<Uint8Array, Error>>;
}
