import { Uri, Wrapper, MaybeAsync } from ".";

export interface WrapperCache {
  get(uri: Uri): MaybeAsync<Wrapper | undefined>;
  has(uri: Uri): MaybeAsync<boolean>;
  set(uris: Uri[], wrapper: Wrapper): MaybeAsync<void>;
  set(uri: Uri, wrapper: Wrapper): MaybeAsync<void>;
}
