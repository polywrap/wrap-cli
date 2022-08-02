import { getEnvFromUriOrResolutionPath } from "./getEnvFromUriOrResolutionPath";
import {
  Wrapper,
  WrapperCache,
  Client,
  Env,
  PluginPackage,
  Uri,
} from "../../types";
import { findPluginPackage } from "../../algorithms";
import {
  IUriResolutionResult,
  IUriResolutionStep,
  IUriResolver,
} from "../core";

export class PluginResolver implements IUriResolver {
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
    resolutionPath: IUriResolutionStep[]
  ): Promise<IUriResolutionResult> {
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
