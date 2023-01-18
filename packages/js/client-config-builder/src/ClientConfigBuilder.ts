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
  constructor(
    private readonly _wrapperCache?: IWrapperCache,
    private readonly _resolver?: IUriResolver<unknown>
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
        this._resolver ??
        RecursiveResolver.from(
          PackageToWrapperCacheResolver.from(
            [
              StaticResolver.from([
                ...clientConfig.redirects,
                ...clientConfig.wrappers,
                ...clientConfig.packages,
              ]),
              ...clientConfig.resolvers,
              new ExtendableUriResolver(),
            ],
            this._wrapperCache ?? new WrapperCache()
          )
        ),
    };
  }
}
