import { getEnvFromUriOrResolutionStack } from "../getEnvFromUriOrResolutionStack";
import {
  UriResolver,
  UriResolutionResult,
  UriResolutionStack,
} from "../../core";
import {
  Wrapper,
  WrapperCache,
  Client,
  Env,
  PluginFactory,
  Uri,
} from "../../../types";
import { findPluginRegistration } from "../../../algorithms";

export class PluginResolver implements UriResolver {
  constructor(
    private readonly createPluginWrapper: (
      uri: Uri,
      plugin: PluginFactory<unknown>,
      environment: Env<Uri> | undefined
    ) => Wrapper
  ) {}

  public get name(): string {
    return PluginResolver.name;
  }

  async resolveUri(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: UriResolutionStack
  ): Promise<UriResolutionResult> {
    const plugin = findPluginRegistration(uri, client.getPlugins({}));

    if (plugin) {
      const environment = getEnvFromUriOrResolutionStack(
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
