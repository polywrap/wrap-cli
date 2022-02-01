import { Uri } from "../../../types";
import { UriResolutionStack } from "./UriResolutionStack";

export class UriResolutionHistory {
  constructor(public readonly stack: UriResolutionStack) {}

  getResolvers(): string[] {
    return this.stack.map(({ resolver }) => resolver);
  }

  getUris(): Uri[] {
    return this.stack.map(({ result: { uri } }) => uri);
  }

  // Resolution path includes the list of resolvers that redirected to another URI or returned the API
  getResolutionPath(): UriResolutionHistory {
    const path: UriResolutionHistory = new UriResolutionHistory(
      this.stack.filter(
        (x) => x.sourceUri.uri !== x.result.uri.uri || x.result.api
      )
    );

    return path;
  }
}
