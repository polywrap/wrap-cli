import { Uri, Wrapper } from ".";

export interface WrapperCache {
  get(uri: Uri): Promise<Wrapper | undefined>;
  has(uri: Uri): Promise<boolean>;
  set(uris: Uri[], wrapper: Wrapper): Promise<void>;
  set(uri: Uri, wrapper: Wrapper): Promise<void>;
}
