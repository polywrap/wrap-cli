import { IWrapperCache } from "./IWrapperCache";

import { Wrapper, Uri } from "@polywrap/core-js";

export class WrapperCache implements IWrapperCache {
  private _map: Map<string, Wrapper> = new Map();

  get(uri: Uri): Wrapper | undefined {
    return this._map.get(uri.uri);
  }

  set(uris: Uri, wrapper: Wrapper): void {
    this._map.set(uris.uri, wrapper);
  }
}
