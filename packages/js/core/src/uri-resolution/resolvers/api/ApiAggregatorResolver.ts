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
import { UriToApiResolver, UriResolutionStack } from "../../core";
import { ApiResolver } from "./ApiResolver";

export type ApiAggregatorResolverResult = UriResolutionResult & {
  resolverUri?: Uri;
};

export class ApiAggregatorResolver implements UriToApiResolver {
  private hasLoadedAllResolvers: boolean;

  constructor(
    private readonly createApi: CreateApiFunc,
    private deserializeOptions?: DeserializeManifestOptions
  ) {}

  public get name(): string {
    return ApiAggregatorResolver.name;
  }

  async resolveUri(
    uri: Uri,
    client: Client,
    cache: ApiCache,
    resolutionPath: UriResolutionStack
  ): Promise<ApiAggregatorResolverResult> {
    const resolverUris = getImplementations(
      coreInterfaceUris.uriResolver,
      client.getInterfaces({}),
      client.getRedirects({})
    );

    if (!this.hasLoadedAllResolvers) {
      const {
        success,
        failedResolverUris,
      } = await client.tryLoadApiResolvers();

      if (!success) {
        return {
          uri: uri,
          error: `Could not load the following API resolvers: ${failedResolverUris}`,
        };
      }

      this.hasLoadedAllResolvers = true;
    }

    const resolvers: ApiResolver[] = await this.buildApiResolvers(resolverUris);

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
          resolverUri: resolver.resolverUri,
        };
      }
    }

    return {
      uri,
    };
  }

  async buildApiResolvers(resolverUris: Uri[]): Promise<ApiResolver[]> {
    const resolvers: ApiResolver[] = [];

    for (const resolverUri of resolverUris) {
      const apiResolver = new ApiResolver(
        resolverUri,
        this.createApi,
        this.deserializeOptions
      );

      resolvers.push(apiResolver);
    }

    return resolvers;
  }
}
