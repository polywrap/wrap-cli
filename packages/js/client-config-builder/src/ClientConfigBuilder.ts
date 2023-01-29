import { getDefaultConfig } from "./bundles";
import { BaseClientConfigBuilder } from "./BaseClientConfigBuilder";
import { IClientConfigBuilder } from "./types/IClientConfigBuilder";

import { CoreClientConfig, IUriResolver } from "@polywrap/core-js";
import {
  IWrapperCache,
  PackageToWrapperCacheResolver,
  RecursiveResolver,
  StaticResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";

export class ClientConfigBuilder extends BaseClientConfigBuilder {
  // $start: ClientConfigBuilder-constructor
  /**
   * Instantiate a ClientConfigBuilder
   */
  constructor() /* $ */ {
    super();
  }

  addDefaults(): IClientConfigBuilder {
    return this.add(getDefaultConfig());
  }

  build(
    wrapperCache?: IWrapperCache,
    resolver?: IUriResolver<unknown>
  ): CoreClientConfig {
    return {
      envs: this.buildEnvs(),
      interfaces: this.buildInterfaces(),
      resolver:
        resolver ??
        RecursiveResolver.from(
          PackageToWrapperCacheResolver.from(
            [
              StaticResolver.from([
                ...this.buildRedirects(),
                ...this.buildWrappers(),
                ...this.buildPackages(),
              ]),
              ...this._config.resolvers,
              new ExtendableUriResolver(),
            ],
            wrapperCache ?? new WrapperCache()
          )
        ),
    };
  }
}
