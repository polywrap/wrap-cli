import { getDefaultConfig } from "./bundles";
import { BaseClientConfigBuilder } from "./BaseClientConfigBuilder";

import { CoreClientConfig, Uri, IUriResolver } from "@polywrap/core-js";
import {
  IWrapperCache,
  LegacyRedirectsResolver,
  PackageToWrapperCacheResolver,
  RecursiveResolver,
  StaticResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";

export class ClientConfigBuilder extends BaseClientConfigBuilder {
  addDefaults(): ClientConfigBuilder {
    return this.add(getDefaultConfig());
  }

  buildCoreConfig(
    wrapperCache?: IWrapperCache,
    resolver?: IUriResolver<unknown>
  ): CoreClientConfig<Uri> {
    return {
      envs: this.config.envs,
      interfaces: this.config.interfaces,
      redirects: this.config.redirects,
      resolver:
        resolver ??
        RecursiveResolver.from(
          PackageToWrapperCacheResolver.from(
            [
              new LegacyRedirectsResolver(),
              StaticResolver.from([
                ...this.config.wrappers,
                ...this.config.packages,
              ]),
              ...this.config.resolvers,
              new ExtendableUriResolver(),
            ],
            wrapperCache ?? new WrapperCache()
          )
        ),
    };
  }
}
