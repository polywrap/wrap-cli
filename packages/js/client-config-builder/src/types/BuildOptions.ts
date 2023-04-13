import { IResolutionResultCache } from "@polywrap/uri-resolvers-js";
import { IUriResolver } from "@polywrap/core-js";

export type BuildOptions =
  | {
      resolutionResultCache: IResolutionResultCache;
    }
  | {
      resolver: IUriResolver<unknown>;
    };
