import {
  Uri,
  Client,
  WrapperCache,
  getImplementations,
  coreInterfaceUris,
  DeserializeWrapManifestOptions,
} from "../../..";
import { CreateWrapperFunc } from "./types/CreateWrapperFunc";
import { UriResolutionResult } from "../../core/types/UriResolutionResult";
import { UriResolver, UriResolutionStack } from "../../core";
import { UriResolverWrapper } from "./UriResolverWrapper";
import { Queue } from "../../../utils/Queue";

export type ExtendableUriResolverResult = UriResolutionResult & {
  implementationUri?: Uri;
};

export class ExtendableUriResolver implements UriResolver {
  private _hasLoadedUriResolvers: boolean;

  constructor(
    private readonly _createWrapper: CreateWrapperFunc,
    private _deserializeOptions?: DeserializeWrapManifestOptions,
    disablePreload?: boolean
  ) {
    if (disablePreload) {
      this._hasLoadedUriResolvers = true;
    }
  }

  public get name(): string {
    return ExtendableUriResolver.name;
  }

  async resolveUri(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: UriResolutionStack
  ): Promise<ExtendableUriResolverResult> {
    const uriResolverImpls = getImplementations(
      coreInterfaceUris.uriResolver,
      client.getInterfaces({}),
      client.getRedirects({})
    );

    if (!this._hasLoadedUriResolvers) {
      const {
        success,
        failedUriResolvers,
      } = await this.loadUriResolverWrappers(client, cache, uriResolverImpls);

      if (!success) {
        return {
          uri: uri,
          error: new Error(
            `Could not load the following URI Resolver implementations: ${failedUriResolvers}`
          ),
        };
      }

      this._hasLoadedUriResolvers = true;
    }

    const resolvers: UriResolverWrapper[] = await this._createUriResolverWrappers(
      uriResolverImpls
    );

    for (const resolver of resolvers) {
      const result = await resolver.resolveUri(
        uri,
        client,
        cache,
        resolutionPath
      );

      if (result.wrapper || (result.uri && uri.uri !== result.uri.uri)) {
        return {
          uri: result.uri,
          wrapper: result.wrapper,
          implementationUri: resolver.implementationUri,
        };
      }
    }

    return {
      uri,
    };
  }

  async loadUriResolverWrappers(
    client: Client,
    cache: WrapperCache,
    implementationUris: Uri[]
  ): Promise<{
    success: boolean;
    failedUriResolvers: string[];
  }> {
    const bootstrapUriResolvers = client
      .getUriResolvers({})
      .filter((x) => x.name !== ExtendableUriResolver.name);

    const implementationsToLoad = new Queue<Uri>();

    for (const implementationUri of implementationUris) {
      if (!cache.has(implementationUri.uri)) {
        implementationsToLoad.enqueue(implementationUri);
      }
    }

    let implementationUri: Uri | undefined;
    let failedAttempts = 0;

    while ((implementationUri = implementationsToLoad.dequeue())) {
      // Use only the bootstrap resolvers to resolve the resolverUri
      // If successful, it is automatically cached
      const { wrapper } = await client.resolveUri(implementationUri, {
        config: {
          uriResolvers: bootstrapUriResolvers,
        },
      });

      if (!wrapper) {
        // If not successful, add the resolver to the end of the queue
        implementationsToLoad.enqueue(implementationUri);
        failedAttempts++;

        if (failedAttempts === implementationsToLoad.length) {
          return {
            success: false,
            failedUriResolvers: implementationsToLoad
              .toArray()
              .map((x) => x.uri),
          };
        }
      } else {
        // If successful, it is automatically cached during the resolveUri method
        failedAttempts = 0;
      }
    }

    this._hasLoadedUriResolvers = true;

    return {
      success: true,
      failedUriResolvers: [],
    };
  }

  private async _createUriResolverWrappers(
    implementationUris: Uri[]
  ): Promise<UriResolverWrapper[]> {
    const uriResolverImpls: UriResolverWrapper[] = [];

    for (const implementationUri of implementationUris) {
      const uriResolverImpl = new UriResolverWrapper(
        implementationUri,
        this._createWrapper,
        this._deserializeOptions
      );

      uriResolverImpls.push(uriResolverImpl);
    }

    return uriResolverImpls;
  }
}
