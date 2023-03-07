import { IWrapperCache } from "@polywrap/uri-resolvers-js";
import { IUriResolver } from "@polywrap/core-js";

export type BuildOptions =
  | {
      wrapperCache: IWrapperCache;
    }
  | {
      resolver: IUriResolver<unknown>;
    };
