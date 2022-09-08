import { UriResolverAggregator, PluginResolver } from "..";

import { Uri, PluginPackage, Env, Wrapper, Client } from "@polywrap/core-js";

export class LegacyPluginsResolver extends UriResolverAggregator {
  constructor(
    createPluginWrapper: (
      uri: Uri,
      plugin: PluginPackage<unknown>,
      environment: Env<Uri> | undefined
    ) => Wrapper
  ) {
    super(
      async (uri: Uri, client: Client) =>
        client
          .getPlugins({})
          .map((x) => new PluginResolver(x, createPluginWrapper)),
      "LegacyPluginsResolver"
    );
  }
}
