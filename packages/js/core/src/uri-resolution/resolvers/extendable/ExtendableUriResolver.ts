import {
  Uri,
  Client,
  ApiCache,
  getImplementations,
  coreInterfaceUris,
  DeserializeManifestOptions,
} from "../../..";
import { CreateApiFunc } from "./types/CreateApiFunc";
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
    private readonly _createApi: CreateApiFunc,
    private _deserializeOptions?: DeserializeManifestOptions,
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
    cache: ApiCache,
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

      if (result.api || (result.uri && uri.uri !== result.uri.uri)) {
        return {
          uri: result.uri,
          api: result.api,
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
    cache: ApiCache,
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
      const { api } = await client.resolveUri(implementationUri, {
        config: {
          uriResolvers: bootstrapUriResolvers,
        },
      });

      if (!api) {
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
        this._createApi,
        this._deserializeOptions
      );

      uriResolverImpls.push(uriResolverImpl);
    }

    return uriResolverImpls;
  }
}
