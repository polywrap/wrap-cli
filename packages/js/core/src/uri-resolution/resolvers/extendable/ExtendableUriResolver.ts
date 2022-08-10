import { CreateWrapperFunc } from "./types/CreateWrapperFunc";
import { IUriResolver } from "../../core";
import { UriResolverWrapper } from "../UriResolverWrapper";

import { DeserializeManifestOptions } from "@polywrap/wrap-manifest-types-js";
import { UriResolutionResult } from "../../core";
import { UriResolverAggregatorBase } from "..";
import {
  Uri,
  Client,
  getImplementations,
  coreInterfaceUris,
  WrapperCache,
} from "../../..";
import { InfiniteLoopError } from "../InfiniteLoopError";
import { Err, Ok, Result } from "../../../types";
import { UriResolutionResponse } from "../../core/UriResolutionResponse";

export type ExtendableUriResolverResult = UriResolutionResult<
  LoadResolverExtensionsError | InfiniteLoopError
>;

export class LoadResolverExtensionsError {
  readonly message: string;

  constructor(public readonly failedUriResolvers: string[]) {
    this.message = `Could not load the following URI Resolver implementations: ${failedUriResolvers}`;
  }
}

export class ExtendableUriResolver extends UriResolverAggregatorBase<LoadResolverExtensionsError> {
  constructor(
    options: { fullResolution: boolean },
    private readonly _createWrapper: CreateWrapperFunc,
    private _deserializeOptions?: DeserializeManifestOptions
  ) {
    super(options);
  }

  get name(): string {
    return ExtendableUriResolver.name;
  }

  async getUriResolvers(
    uri: Uri,
    client: Client
  ): Promise<Result<IUriResolver<unknown>[], LoadResolverExtensionsError>> {
    const uriResolverImpls = getImplementations(
      coreInterfaceUris.uriResolver,
      client.getInterfaces({}),
      client.getRedirects({})
    );

    // if (!this._hasLoadedUriResolvers) {
    //   const {
    //     success,
    //     failedUriResolvers,
    //   } = await this.loadUriResolverWrappers(client, cache, uriResolverImpls);

    //   if (!success) {
    //     return new LoadResolverExtensionsError(failedUriResolvers);
    //   }

    //   this._hasLoadedUriResolvers = true;
    // }

    const resolvers: UriResolverWrapper[] = await this._createUriResolverWrappers(
      uriResolverImpls
    );

    return Ok(resolvers);
  }

  private resolverIndex = -1;

  async tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<ExtendableUriResolverResult> {
    const result = await this.getUriResolvers(uri, client);

    if (!result.ok) {
      return {
        response: Err(result.error),
      };
    }

    const resolvers = result.value;

    this.resolverIndex++;

    if (this.resolverIndex >= resolvers.length) {
      return {
        response: Ok(new UriResolutionResponse(uri)),
        history: [],
      };
    }

    try {
      const result = await super.tryResolveToWrapperWithResolvers(
        uri,
        client,
        cache,
        resolvers.slice(this.resolverIndex, resolvers.length)
      );

      return result;
    } catch (ex) {
      console.log("THROOOOWN", ex);
      this.resolverIndex = -1;
      throw ex;
    }
  }

  // async loadUriResolverWrappers(
  //   client: Client,
  //   cache: WrapperCache,
  //   implementationUris: Uri[]
  // ): Promise<{
  //   success: boolean;
  //   failedUriResolvers: string[];
  // }> {
  //   const implementationsToLoad = new Queue<Uri>();

  //   for (const implementationUri of implementationUris) {
  //     if (!cache.has(implementationUri.uri)) {
  //       implementationsToLoad.enqueue(implementationUri);
  //     }
  //   }

  //   let implementationUri: Uri | undefined;
  //   let failedAttempts = 0;

  //   const loadedImplementations: string[] = [];
  //   while ((implementationUri = implementationsToLoad.dequeue())) {
  //     // Use only loadeded URI resolver extensions to resolve the implementation URI
  //     // If successful, it is added to the list of loaded implementations

  //     const { wrapper } = await client.tryResolveToWrapper({
  //       uri: implementationUri,
  //       config: {
  //         uriResolver: [
  //           ...bootstrapUriResolvers,
  //           ...loadedImplementations.map(
  //             (x) =>
  //               new UriResolverWrapper(
  //                 new Uri(x),
  //                 this._createWrapper,
  //                 this._deserializeOptions
  //               )
  //           ),
  //         ],
  //       },
  //     });

  //     if (!wrapper) {
  //       // If not successful, add the resolver to the end of the queue
  //       implementationsToLoad.enqueue(implementationUri);
  //       failedAttempts++;

  //       if (failedAttempts === implementationsToLoad.length) {
  //         return {
  //           success: false,
  //           failedUriResolvers: implementationsToLoad
  //             .toArray()
  //             .map((x) => x.uri),
  //         };
  //       }
  //     } else {
  //       cache.set(implementationUri.uri, wrapper);
  //       loadedImplementations.push(implementationUri.uri);
  //       failedAttempts = 0;
  //     }
  //   }

  //   this._hasLoadedUriResolvers = true;

  //   return {
  //     success: true,
  //     failedUriResolvers: [],
  //   };
  // }

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
