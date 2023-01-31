import { IWrapperCache } from "./IWrapperCache";

import { Wrapper, Uri } from "@polywrap/core-js";

// $start: WrapperCache
/**
 * A minimal implementation of IWrapperCache
 * */
export class WrapperCache implements IWrapperCache /* $ */ {
  private _map: Map<string, Wrapper> = new Map();

  // $start: WrapperCache-get
  /** get a Wrapper from the cache, given its URI index */
  get(uri: Uri): Wrapper | undefined /* $ */ {
    return this._map.get(uri.uri);
  }

  // $start: WrapperCache-set
  /** add a Wrapper to the cache, indexed by a URI */
  set(uris: Uri, wrapper: Wrapper): void /* $ */ {
    this._map.set(uris.uri, wrapper);
  }
}
