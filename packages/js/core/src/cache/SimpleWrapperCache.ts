import { Uri, Wrapper, WrapperCache } from "../types";

export class SimpleCache implements WrapperCache {
  private _map: Map<string, Wrapper> = new Map();

  get(uri: Uri): Wrapper | undefined {
    return this._map.get(uri.uri);
  }

  has(uri: Uri): boolean {
    return this._map.has(uri.uri);
  }

  set(uris: Uri | Uri[], wrapper: Wrapper): void {
    if (Array.isArray(uris)) {
      for (const uri of uris) {
        this._map.set(uri.uri, wrapper);
      }
    } else {
      this._map.set(uris.uri, wrapper);
    }
  }
}
