import { getEnvFromUriOrResolutionStack } from "../getEnvFromUriOrResolutionStack";
import {
  UriToApiResolver,
  UriResolutionResult,
  UriResolutionStack,
} from "../../core";
import { Api, ApiCache, Client, Env, PluginPackage, Uri } from "../../../types";
import { findPluginPackage } from "../../../algorithms";

export class PluginResolver implements UriToApiResolver {
  constructor(
    private readonly createPluginApi: (
      uri: Uri,
      plugin: PluginPackage,
      environment: Env<Uri> | undefined
    ) => Api
  ) {}

  public get name(): string {
    return PluginResolver.name;
  }

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
