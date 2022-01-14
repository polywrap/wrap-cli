import { ApiResolver, UriResolutionStack, UriToApiResolver } from "..";
import { Uri, Client, getImplementations, coreInterfaceUris, DeserializeManifestOptions } from "../../..";
import { CreateApiFunc } from "./CreateApiFunc";
import { UriResolutionResult } from "./UriResolutionResult";

export type ApiAggregatorResolverResult = UriResolutionResult & {
  resolverUri?: Uri;
};

export class ApiAggregatorResolver implements UriToApiResolver {
  name = "ApiAggregator";

  constructor(
      private readonly createApi: CreateApiFunc,
      private deserializeOptions?: DeserializeManifestOptions
    ) {
  }

  async resolveUri(uri: Uri, client: Client, resolutionStack: UriResolutionStack): Promise<ApiAggregatorResolverResult> {
    const resolvers: ApiResolver[] = this.buildApiResolvers(client);

    for (const resolver of resolvers) {
      const result = await resolver.resolveUri(uri, client, resolutionStack);

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

  buildApiResolvers(
    client: Client, 
  ): ApiResolver[] {
    const resolvers: ApiResolver[] = [];
  
    const resolverUris = getImplementations(
      coreInterfaceUris.uriResolver,
      client.getInterfaces({}),
      client.getRedirects({})
    );
  
    for(const resolverUri of resolverUris) {
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