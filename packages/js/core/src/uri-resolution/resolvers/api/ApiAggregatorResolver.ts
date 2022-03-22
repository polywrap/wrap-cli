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
  private hadLoadedAllResolvers: boolean = false;

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
    const resolvers: ApiResolver[] = await this.buildApiResolvers(
      client,
      cache
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
          resolverUri: resolver.resolverUri,
        };
      }
    }

    return {
      uri,
    };
  }

  async buildApiResolvers(
    client: Client,
    cache: ApiCache
  ): Promise<ApiResolver[]> {
    const resolverUris = getImplementations(
      coreInterfaceUris.uriResolver,
      client.getInterfaces({}),
      client.getRedirects({})
    );

    console.log("building resolvers - ", this.hadLoadedAllResolvers);
    if (!this.hadLoadedAllResolvers) {
      await loadUriResolvers(resolverUris, client, cache);
      this.hadLoadedAllResolvers = true;
      console.log("loaded");
    }

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

export async function loadUriResolvers(
  resolverUris: Uri[],
  client: Client,
  cache: ApiCache
) {
  const bootstrapResolvers =
    getAllResolversWithoutApiAggregatorResolver(client);
  const unloadedResolvers = new Queue<Uri>();

  console.log("resolverUris", resolverUris);
  // create 2 buckets, pre-loaded & unloaded resolvers
  for (const resolverUri of resolverUris) {
    if (!cache.has(resolverUri.uri)) {
      unloadedResolvers.enqueue(resolverUri);
    }
  }
  console.log("unloadedResolvers", unloadedResolvers);

  // load all missing resolvers
  let resolverUri: Uri | undefined;
  let failedAttempts = 0;

  while (!!(resolverUri = unloadedResolvers.dequeue())) {
    console.log("loading resolver", resolverUri);
    // We are ONLY using the bootstrap resolvers
    // to load the resolver itself
    const { api } = await client.resolveUri(resolverUri, {
      config: {
        resolvers: bootstrapResolvers,
      },
    });

    if (!api) {
      console.log("failed to load", resolverUri);
      unloadedResolvers.enqueue(resolverUri);
      failedAttempts++;
    } else {
      failedAttempts = 0;
      console.log("loaded", resolverUri);
    }

    if (failedAttempts === unloadedResolvers.length) {
      throw Error(
        `Unable to load the following URI resolvers: ${unloadedResolvers.toArray()}`
      );
    }
  }

  return bootstrapResolvers;
}

export function getAllResolversWithoutApiAggregatorResolver(client: Client) {
  const resolvers = client.getResolvers({});

  return resolvers.filter((x) => x.name !== ApiAggregatorResolver.name);
}