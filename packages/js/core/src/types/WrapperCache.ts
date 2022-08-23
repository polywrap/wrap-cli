import { Uri, Wrapper } from ".";

export interface WrapperCache {
  get(uri: Uri): Wrapper | undefined;
  has(uri: Uri): boolean;
  set(uris: Uri[], wrapper: Wrapper): void;
  set(uri: Uri, wrapper: Wrapper): void;
}
