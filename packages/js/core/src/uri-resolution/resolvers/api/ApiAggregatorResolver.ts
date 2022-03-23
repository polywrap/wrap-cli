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
import { Queue } from "../../../utils/Queue";

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
      const { success, failedResolverUris } = await tryLoadAllApiResolvers(
        resolverUris,
        client,
        cache
      );

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
const tryLoadAllApiResolvers = async (
  resolverUris: Uri[],
  client: Client,
  cache: ApiCache
): Promise<{
  success: boolean;
  failedResolverUris: string[];
}> => {
  const bootstrapResolvers = getAllResolversWithoutApiAggregatorResolver(
    client
  );
  const unloadedResolvers = new Queue<Uri>();

  for (const resolverUri of resolverUris) {
    if (!cache.has(resolverUri.uri)) {
      unloadedResolvers.enqueue(resolverUri);
    }
  }

  let resolverUri: Uri | undefined;
  let failedAttempts = 0;

  while ((resolverUri = unloadedResolvers.dequeue())) {
    console.log("loading resolver", resolverUri);

    // Use only the bootstrap (cached) resolvers to resolve the resolverUri
    // If successful, it is automatically cached
    const { api } = await client.resolveUri(resolverUri, {
      config: {
        resolvers: bootstrapResolvers,
      },
    });

    if (!api) {
      // If not successful, add the resolver to the end of the queue
      unloadedResolvers.enqueue(resolverUri);
      failedAttempts++;
    } else {
      // If successful, it is automatically cached during the resolveUri method
      failedAttempts = 0;
    }

    if (failedAttempts === unloadedResolvers.length) {
      return {
        success: false,
        failedResolverUris: unloadedResolvers.toArray().map((x) => x.uri),
      };
    }
  }

  return {
    success: true,
    failedResolverUris: [],
  };
};

const getAllResolversWithoutApiAggregatorResolver = (client: Client) => {
  const resolvers = client.getResolvers({});

  return resolvers.filter((x) => x.name !== ApiAggregatorResolver.name);
};
