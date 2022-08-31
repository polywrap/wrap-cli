import { PluginResolver } from "./PluginResolver";
import { UriResolverAggregator } from "../aggregator";

import {
  PluginRegistration,
  Uri,
  PluginPackage,
  Env,
  Wrapper,
} from "@polywrap/core-js";

export class PluginsResolver extends UriResolverAggregator {
  constructor(
    pluginRegistrations: PluginRegistration<string | Uri>[],
    private readonly createPluginWrapper: (
      uri: Uri,
      plugin: PluginPackage<unknown>,
      environment: Env<Uri> | undefined
    ) => Wrapper
  ) {
    super(
      pluginRegistrations.map(
        (x) => new PluginResolver(x, this.createPluginWrapper)
      )
    );
  }

  get name(): string {
    return "PluginsResolver";
  }
}
