import { Uri, Wrapper, WrapperCache } from "../types";

export class SimpleCache implements WrapperCache {
  private _map: Map<string, Wrapper> = new Map();

  get(uri: Uri): Promise<Wrapper | undefined> {
    return Promise.resolve(this._map.get(uri.uri));
  }

  has(uri: Uri): Promise<boolean> {
    return Promise.resolve(this._map.has(uri.uri));
  }

  set(uris: Uri | Uri[], wrapper: Wrapper): Promise<void> {
    if (Array.isArray(uris)) {
      for (const uri of uris) {
        this._map.set(uri.uri, wrapper);
      }
    } else {
      this._map.set(uris.uri, wrapper);
    }
    return Promise.resolve();
  }
}
