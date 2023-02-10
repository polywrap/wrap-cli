import { getUriResolutionPath } from "./getUriResolutionPath";

import { Uri, IUriResolutionStep } from "@polywrap/core-js";

export class InfiniteLoopError extends Error {
  constructor(
    private readonly _uri: Uri,
    private readonly _history: IUriResolutionStep<unknown>[]
  ) {
    super();
  }

  message = `An infinite loop was detected while resolving the URI: ${
    this._uri.uri
  }\nHistory: ${JSON.stringify(getUriResolutionPath(this._history), null, 2)}`;
}
