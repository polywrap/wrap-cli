import { getDefaultConfig } from "./bundles";
import { BaseClientConfigBuilder } from "./BaseClientConfigBuilder";
import { IClientConfigBuilder } from "./IClientConfigBuilder";

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
  constructor(
    private readonly wrapperCache?: IWrapperCache,
    private readonly resolver?: IUriResolver<unknown>
  ) {
    super();
  }

  addDefaults(): IClientConfigBuilder {
    return this.add(getDefaultConfig());
  }

  buildCoreConfig(): CoreClientConfig {
    const clientConfig = this.build();

    return {
      envs: clientConfig.envs,
      interfaces: clientConfig.interfaces,
      resolver:
        this.resolver ??
        RecursiveResolver.from(
          PackageToWrapperCacheResolver.from(
            [
              StaticResolver.from([
                ...clientConfig.redirects,
                ...clientConfig.wrappers,
                ...clientConfig.packages,
              ]),
              ...this._config.resolvers,
              new ExtendableUriResolver(),
            ],
            this.wrapperCache ?? new WrapperCache()
          )
        ),
    };
  }
}
