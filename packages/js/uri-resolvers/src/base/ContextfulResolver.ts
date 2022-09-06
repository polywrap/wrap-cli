import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionContext,
  UriResolutionContext,
  UriPackageOrWrapper,
  UriResolutionResult,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";
import { InfiniteLoopError } from "../InfiniteLoopError";

export abstract class ContextfulResolver<TError = undefined>
  implements IUriResolver<TError | InfiniteLoopError> {
  constructor(
    protected resolverName: string,
    private fullResolution?: boolean
  ) {}

  async tryResolveUri(
    uri: Uri,
    client: Client,
    resolutionContext?: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | InfiniteLoopError>> {
    if (!resolutionContext) {
      resolutionContext = new UriResolutionContext();
    } else {
      if (resolutionContext.hasVisited(uri)) {
        return UriResolutionResult.err(
          new InfiniteLoopError(uri, resolutionContext.getHistory())
        );
      }
    }

    resolutionContext.visit(uri);

    let result = await this.tryResolveUriWithContext(
      uri,
      client,
      resolutionContext
    );

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      description: this.resolverName,
    });

    if (this.fullResolution) {
      result = await this.tryResolveAgainIfRedirect(
        result,
        uri,
        client,
        resolutionContext
      );
    }

    resolutionContext.unvisit(uri);

    return result;
  }

  protected abstract async tryResolveUriWithContext(
    uri: Uri,
    client: Client,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | InfiniteLoopError>>;

  private async tryResolveAgainIfRedirect(
    result: Result<UriPackageOrWrapper, TError | InfiniteLoopError>,
    uri: Uri,
    client: Client,
    resolutionContext?: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | InfiniteLoopError>> {
    if (result.ok && result.value.type === "uri") {
      const resultUri = result.value.uri;

      if (resultUri.uri !== uri.uri) {
        result = await this.tryResolveUri(resultUri, client, resolutionContext);
      }
    }

    return result;
  }
}
