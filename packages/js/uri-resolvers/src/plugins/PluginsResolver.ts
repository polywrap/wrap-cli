import { PluginResolver } from "./PluginResolver";
import { UriResolverAggregator } from "../aggregator";

import { PluginRegistration, Uri } from "@polywrap/core-js";

export class PluginsResolver extends UriResolverAggregator {
  constructor(pluginRegistrations: PluginRegistration<string | Uri>[]) {
    super(
      pluginRegistrations.map((x) => new PluginResolver(x)),
      "PluginsResolver"
    );
  }
}
