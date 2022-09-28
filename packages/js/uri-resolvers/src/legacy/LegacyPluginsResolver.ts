import { UriResolverAggregator, PluginResolver } from "..";

import { Uri, Client } from "@polywrap/core-js";

export class LegacyPluginsResolver extends UriResolverAggregator {
  constructor() {
    super(
      async (_: Uri, client: Client) =>
        client.getPlugins().map((x) => new PluginResolver(x)),
      "LegacyPluginsResolver"
    );
  }
}
