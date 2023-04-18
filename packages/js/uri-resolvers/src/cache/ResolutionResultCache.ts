import { IResolutionResultCache } from "./IResolutionResultCache";

import { Uri, Result, UriPackageOrWrapper } from "@polywrap/core-js";

// $start: ResolutionResultCache
/**
 * A minimal implementation of IResolutionResultCache
 * */
export class ResolutionResultCache<TError = unknown>
  implements IResolutionResultCache<TError> /* $ */ {
  private _map: Map<string, Result<UriPackageOrWrapper, TError>> = new Map();

  // $start: ResolutionResultCache-get
  /** get a Result from the cache, given its URI index */
  get(uri: Uri): Result<UriPackageOrWrapper, TError> | undefined /* $ */ {
    return this._map.get(uri.uri);
  }

  // $start: ResolutionResultCache-set
  /** add a Result to the cache, indexed by a URI */
  set(uris: Uri, result: Result<UriPackageOrWrapper, TError>): void /* $ */ {
    this._map.set(uris.uri, result);
  }
}
