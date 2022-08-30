import { MaybeAsync, Uri, Wrapper } from "@polywrap/core-js";

export interface IWrapperCache {
  get(uri: Uri): MaybeAsync<Wrapper | undefined>;
  set(uri: Uri, wrapper: Wrapper): MaybeAsync<void>;
}
