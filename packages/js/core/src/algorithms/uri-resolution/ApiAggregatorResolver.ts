import { ApiResolver, UriToApiResolver } from ".";
import { Uri, Client, Contextualized, getImplementations, coreInterfaceUris, Api, Web3ApiManifest } from "../..";
import { UriResolutionResult } from "./UriResolutionResult";

export type CreateApiFunc = (
  uri: Uri, 
  manifest: Web3ApiManifest, 
  uriResolver: Uri, 
  client: Client, 
  options: Contextualized
) => Api;

export type ApiAggregatorResolverResult = UriResolutionResult & {
  resolverUri?: Uri;
};

export class ApiAggregatorResolver implements UriToApiResolver {
  name = "ApiAggregator";

  constructor(
      private readonly createApi: CreateApiFunc 
    ) {
  }

  async resolveUri(uri: Uri, client: Client, options: Contextualized): Promise<ApiAggregatorResolverResult> {
    const resolvers: ApiResolver[] = buildApiResolvers(client, options, this.createApi);

    for (const resolver of resolvers) {
      const result = await resolver.resolveUri(uri, client, options);

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
  };
}

const buildApiResolvers = (client: Client, options: Contextualized, createApi: CreateApiFunc) => {
  const resolvers: ApiResolver[] = [];

  const resolverUris = getImplementations(
    coreInterfaceUris.uriResolver,
    client.getInterfaces(options),
    client.getRedirects(options)
  );

  for(const resolverUri of resolverUris) {
    const apiResolver = new ApiResolver(
      resolverUri,
      createApi
    );

    resolvers.push(apiResolver);
  }

  return resolvers;
};