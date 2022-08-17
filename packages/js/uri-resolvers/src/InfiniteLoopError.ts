import { IUriResolutionStep, Uri } from "@polywrap/core-js";
import { getUriResolutionPath } from "./getUriResolutionPath";

export class InfiniteLoopError extends Error {
  constructor(
    private readonly uri: Uri,
    private readonly history: IUriResolutionStep<unknown>[]
  ) {
    super();
  }

  message = `An infinite loop was detected while resolving the URI: ${
    this.uri.uri
  }\nHistory: ${JSON.stringify(getUriResolutionPath(this.history), null, 2)}`;
}
