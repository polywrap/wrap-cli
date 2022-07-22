import { getEnvFromUriOrResolutionPath } from "../getEnvFromUriOrResolutionPath";
import { UriResolver } from "../../core";
import {
  Wrapper,
  WrapperCache,
  Client,
  Env,
  PluginPackage,
  Uri,
} from "../../../types";
import { findPluginPackage } from "../../../algorithms";
import { UriResolutionStep, ResolveUriResult } from "../../core";

export class PluginResolver implements UriResolver<void> {
  constructor(
    private readonly createPluginWrapper: (
      uri: Uri,
      plugin: PluginPackage<unknown>,
      environment: Env<Uri> | undefined
    ) => Wrapper
  ) {}

  public get name(): string {
    return PluginResolver.name;
  }

  async tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: UriResolutionStep[]
  ): Promise<ResolveUriResult<void>> {
    const plugin = findPluginPackage(uri, client.getPlugins({}));

    if (plugin) {
      const environment = getEnvFromUriOrResolutionPath(
        uri,
        resolutionPath,
        client
      );

      const wrapper = this.createPluginWrapper(uri, plugin, environment);

      return {
        uri,
        wrapper,
      };
    }

    return {
      uri,
    };
  }
}
