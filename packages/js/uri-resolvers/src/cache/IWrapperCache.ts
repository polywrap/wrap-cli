import { Uri, Wrapper } from "@polywrap/core-js";

export interface IWrapperCache {
  get(uri: Uri): Wrapper | undefined;
  set(uri: Uri, wrapper: Wrapper): void;
}
