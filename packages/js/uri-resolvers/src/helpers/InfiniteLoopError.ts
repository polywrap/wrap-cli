import { getUriResolutionPath } from "./getUriResolutionPath";

import { Uri, UriResolutionStep } from "@polywrap/wrap-js";

// $start: InfiniteLoopError
/**
 * Error used if the URI resolution path contains an infinite loop
 * */
export class InfiniteLoopError extends Error /* $ */ {
  // $start: InfiniteLoopError-constructor
  /**
   * Create an InfiniteLoopError
   *
   * @param _uri - URI being resolved
   * @param _history - URI resolution history
   * */
  constructor(
    private readonly _uri: Uri,
    private readonly _history: UriResolutionStep<unknown>[]
  ) /* $ */ {
    super();
  }

  message = `An infinite loop was detected while resolving the URI: ${
    this._uri.uri
  }\nHistory: ${JSON.stringify(getUriResolutionPath(this._history), null, 2)}`;
}
