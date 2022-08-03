import { PluginResolver } from ".";
import {
  Env,
  PluginPackage,
  PluginRegistration,
  Uri,
  Wrapper,
} from "../../types";
import { UriResolverAggregator } from "./aggregator/UriResolverAggregator";

export class PluginsResolver extends UriResolverAggregator {
  constructor(
    pluginRegistrations: readonly PluginRegistration<string | Uri>[],
    private readonly createPluginWrapper: (
      uri: Uri,
      plugin: PluginPackage<unknown>,
      environment: Env<Uri> | undefined
    ) => Wrapper,
    options: {
      fullResolution: boolean;
    }
  ) {
    super(
      pluginRegistrations.map(
        (x) => new PluginResolver(x, this.createPluginWrapper)
      ),
      options
    );
  }

  get name(): string {
    return PluginsResolver.name;
  }
}
