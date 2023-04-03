import {
  MaybeAsync,
  Result,
  Uri,
  UriPackageOrWrapper,
} from "@polywrap/core-js";

// $start: IResolutionResultCache
/** A ResolutionResultCache cache */
export interface IResolutionResultCache<TError> {
  /** get a Result from the cache, given its URI index */
  get(uri: Uri): MaybeAsync<Result<UriPackageOrWrapper, TError> | undefined>;

  /** add a Result to the cache, indexed by a URI */
  set(uri: Uri, result: Result<UriPackageOrWrapper, TError>): MaybeAsync<void>;
}
// $end
