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
    const resolvers: ApiResolver[] = this.buildApiResolvers(client);

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

  buildApiResolvers(client: Client): ApiResolver[] {
    const resolvers: ApiResolver[] = [];

    const resolverUris = getImplementations(
      coreInterfaceUris.uriResolver,
      client.getInterfaces({}),
      client.getRedirects({})
    );

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
