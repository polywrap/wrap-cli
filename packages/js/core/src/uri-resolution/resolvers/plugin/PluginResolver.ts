import { getEnvFromUriOrResolutionStack } from "../getEnvFromUriOrResolutionStack";
import {
  IUriToApiResolver,
  UriResolutionResult,
  UriResolutionStack,
} from "../../core";
import { Api, ApiCache, Client, Env, PluginPackage, Uri } from "../../../types";
import { findPluginPackage } from "../../../algorithms";

export class PluginResolver implements IUriToApiResolver {
  constructor(
    private readonly createPluginApi: (
      uri: Uri,
      plugin: PluginPackage,
      environment: Env<Uri> | undefined
    ) => Api
  ) {}

  name = "Plugin";

  async resolveUri(
    uri: Uri,
    client: Client,
    cache: ApiCache,
    resolutionPath: UriResolutionStack
  ): Promise<UriResolutionResult> {
    const plugin = findPluginPackage(uri, client.getPlugins({}));

    if (plugin) {
      const environment = getEnvFromUriOrResolutionStack(
        uri,
        resolutionPath,
        client
      );

      const api = this.createPluginApi(uri, plugin, environment);

      return {
        uri,
        api,
      };
    }

    return {
      uri,
    };
  }
}
