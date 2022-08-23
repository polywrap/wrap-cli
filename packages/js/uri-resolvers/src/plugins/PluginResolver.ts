import {
  Wrapper,
  Client,
  Env,
  PluginPackage,
  Uri,
  PluginRegistration,
  IWrapPackage,
  IUriResolver,
  UriResolutionResponse,
  IUriResolutionResponse,
  toUri,
} from "@polywrap/core-js";
import { getEnvFromUriHistory } from "../getEnvFromUriHistory";

export class PluginResolver implements IUriResolver {
  pluginUri: Uri;

  constructor(
    private readonly pluginRegistration: PluginRegistration<string | Uri>,
    private readonly createPluginWrapper: (
      uri: Uri,
      plugin: PluginPackage<unknown>,
      environment: Env<Uri> | undefined
    ) => Wrapper
  ) {
    this.pluginUri = toUri(pluginRegistration.uri);
  }

  public get name(): string {
    return `${PluginResolver.name} (${this.pluginUri.uri})`;
  }

  async tryResolveUri(uri: Uri): Promise<IUriResolutionResponse> {
    if (uri.uri !== this.pluginUri.uri) {
      return UriResolutionResponse.ok(uri);
    }

    const wrapPackage = new PluginWrapperPackage(
      uri,
      this.pluginRegistration.plugin,
      this.createPluginWrapper
    );

    return UriResolutionResponse.ok(wrapPackage);
  }
}

// TODO: this is a temporary solution until we refactor the plugin package to be an IWrapPackage
export class PluginWrapperPackage implements IWrapPackage {
  constructor(
    public readonly uri: Uri,
    private readonly pluginPackage: PluginPackage<unknown>,
    private readonly createPluginWrapper: (
      uri: Uri,
      plugin: PluginPackage<unknown>,
      environment: Env<Uri> | undefined
    ) => Wrapper
  ) {}

  async createWrapper(client: Client, uriHistory: Uri[]): Promise<Wrapper> {
    const env = getEnvFromUriHistory(uriHistory, client);

    return this.createPluginWrapper(this.uri, this.pluginPackage, env);
  }
}
