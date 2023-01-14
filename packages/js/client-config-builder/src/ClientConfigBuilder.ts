import { getDefaultConfig } from "./bundles";
import { BaseClientConfigBuilder } from "./BaseClientConfigBuilder";

import { CoreClientConfig, Uri, IUriResolver } from "@polywrap/core-js";
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
   *
   * @param wrapperCache?: a wrapper cache to be used in place of the default wrapper cache
   * @param resolver?: a uri resolver to be used in place of any added redirects, wrappers, packages, and resolvers when building a CoreClientConfig
   */
  constructor(
    private readonly wrapperCache?: IWrapperCache,
    private readonly resolver?: IUriResolver<unknown>
  ) /* $ */ {
    super();
  }

  addDefaults(): ClientConfigBuilder {
    return this.add(getDefaultConfig());
  }

  buildCoreConfig(): CoreClientConfig<Uri> {
    return {
      envs: this.config.envs,
      interfaces: this.config.interfaces,
      resolver:
        this.resolver ??
        RecursiveResolver.from(
          PackageToWrapperCacheResolver.from(
            [
              StaticResolver.from([
                ...this.config.redirects,
                ...this.config.wrappers,
                ...this.config.packages,
              ]),
              ...this.config.resolvers,
              new ExtendableUriResolver(),
            ],
            this.wrapperCache ?? new WrapperCache()
          )
        ),
    };
  }
}
