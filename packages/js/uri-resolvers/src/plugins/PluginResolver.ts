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
  getEnvFromUriHistory,
} from "@polywrap/core-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js/build/formats/wrap.info/0.1";

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
    return `PluginResolver (${this.pluginUri.uri})`;
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

  async getManifest(): Promise<WrapManifest> {
    return this.pluginPackage.manifest;
  }

  async createWrapper(client: Client, uriHistory: Uri[]): Promise<Wrapper> {
    const env = getEnvFromUriHistory(uriHistory, client);

    return this.createPluginWrapper(this.uri, this.pluginPackage, env);
  }
}