import {
  Uri,
  Client,
  WrapperCache,
  getImplementations,
  coreInterfaceUris,
} from "../../..";
import { CreateWrapperFunc } from "./types/CreateWrapperFunc";
import {
  IUriResolver,
  UriResolverAggregator,
  IUriResolutionError,
  UriResolutionErrorType,
} from "../../core";
import { UriResolverWrapper } from "../UriResolverWrapper";

import { DeserializeManifestOptions } from "@polywrap/wrap-manifest-types-js";
import { UriResolutionResult } from "../../core";

export type ExtendableUriResolverResult = UriResolutionResult<LoadResolverExtensionsError> & {
  implementationUri?: Uri;
};

export class LoadResolverExtensionsError implements IUriResolutionError {
  type = UriResolutionErrorType.UriResolver;
  readonly message: string;

  constructor(public readonly failedUriResolvers: string[]) {
    this.message = `Could not load the following URI Resolver implementations: ${failedUriResolvers}`;
  }
}

export class ExtendableUriResolver extends UriResolverAggregator {
  private _hasLoadedUriResolvers: boolean;

  constructor(
    options: { fullResolution: boolean },
    private readonly _createWrapper: CreateWrapperFunc,
    private _deserializeOptions?: DeserializeManifestOptions,
    disablePreload?: boolean
  ) {
    super(options);

    if (disablePreload) {
      this._hasLoadedUriResolvers = true;
    }
  }

  get name(): string {
    return ExtendableUriResolver.name;
  }

  async getUriResolvers(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<IUriResolver[] | IUriResolutionError> {
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
        return new LoadResolverExtensionsError(failedUriResolvers);
      }

      this._hasLoadedUriResolvers = true;
    }

    const resolvers: UriResolverWrapper[] = await this._createUriResolverWrappers(
      uriResolverImpls
    );

    return resolvers;
  }

  async loadUriResolverWrappers(
    client: Client,
    cache: WrapperCache,
    implementationUris: Uri[]
  ): Promise<{
    success: boolean;
    failedUriResolvers: string[];
  }> {
    return {
      success: true,
      failedUriResolvers: [],
    };
    // const implementationsToLoad = new Queue<Uri>();

    // for (const implementationUri of implementationUris) {
    //   if (!cache.has(implementationUri.uri)) {
    //     implementationsToLoad.enqueue(implementationUri);
    //   }
    // }

    // let implementationUri: Uri | undefined;
    // let failedAttempts = 0;

    // const loadedImplementations: string[] = [];
    // while ((implementationUri = implementationsToLoad.dequeue())) {
    //   // Use only loadeded URI resolver extensions to resolve the implementation URI
    //   // If successful, it is added to the list of loaded implementations

    //   const { wrapper } = await client.tryResolveToWrapper({
    //     uri: implementationUri,
    //     config: {
    //       uriResolvers: [
    //         ...bootstrapUriResolvers,
    //         ...loadedImplementations.map(
    //           (x) =>
    //             new UriResolverWrapper(
    //               new Uri(x),
    //               this._createWrapper,
    //               this._deserializeOptions
    //             )
    //         ),
    //       ],
    //     },
    //   });

    //   if (!wrapper) {
    //     // If not successful, add the resolver to the end of the queue
    //     implementationsToLoad.enqueue(implementationUri);
    //     failedAttempts++;

    //     if (failedAttempts === implementationsToLoad.length) {
    //       return {
    //         success: false,
    //         failedUriResolvers: implementationsToLoad
    //           .toArray()
    //           .map((x) => x.uri),
    //       };
    //     }
    //   } else {
    //     cache.set(implementationUri.uri, wrapper);
    //     loadedImplementations.push(implementationUri.uri);
    //     failedAttempts = 0;
    //   }
    // }

    // this._hasLoadedUriResolvers = true;

    // return {
    //   success: true,
    //   failedUriResolvers: [],
    // };
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
