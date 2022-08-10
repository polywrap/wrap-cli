import {
  Client,
  Env,
  PluginPackage,
  PluginResolver,
  Uri,
  Wrapper,
} from "../../..";
import { UriResolverAggregator } from "../aggregator/UriResolverAggregator";

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
      {
        fullResolution: false,
      }
    );
  }

  get name(): string {
    return LegacyPluginsResolver.name;
  }
}
